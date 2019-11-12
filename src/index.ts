'use strict'

interface IStateNode {
  name: string
}

type TriggerAction = Function | StateTransition

interface IStateMachineDescription {
  [key: string]: Object | string | TriggerAction
}

class StateTransition {
  public stateName: string
  public operation: Function

  constructor(stateName: string, fn: Function) {
    this.stateName = stateName
    this.operation = fn
  }

  public transition(scope: StateMachine) {
    scope.setState(this.stateName)
  }
}

class StateTrigger implements IStateNode {
  public name: string
  private _action: TriggerAction

  constructor(name: string, action: TriggerAction) {
    this.name = name
    this._action = action
  }

  public call(stateMachine: StateMachine, ...args: any[]) {
    let returnValue: any
    args.unshift({ scope: stateMachine, stateMachine })
    if (this._action instanceof StateTransition) {
      returnValue = this._action.operation.apply(this, args)
      this._action.transition(stateMachine)
    } else {
      returnValue = this._action.apply(this, args)
    }

    return returnValue
  }
}

class StateAction implements IStateNode {
  public name: string
  private _action: Function

  constructor(name: string, action: Function) {
    this.name = name
    this._action = action
  }

  public exec(scope: any) {
    this._action.call(scope)
  }
}

class State implements IStateNode {
  public name: string
  public triggers: StateTrigger[] = []
  private enterAction: StateAction | undefined = undefined
  private entryActionsMap: Map<string, StateAction> = new Map()
  private exitAction: StateAction | undefined = undefined

  constructor(name: string, triggersDescription: object) {
    this.name = name
    for (const [triggerName, triggerAction] of Object.entries(triggersDescription)) {
      if (typeof triggerAction === 'undefined') {
        throw new Error(`StateMachine: undefined reference ${triggerName} for state '${this.name}'`)
      }

      switch (triggerName) {
        case StateMachine.ON_ENTER:
          this.enterAction = new StateAction(triggerName, triggerAction as Function)
          break
        case StateMachine.ON_ENTRY_FROM:
          for (const [stateName, onEntryAction] of Object.entries(triggerAction)) {
            const onEntryStateAction = new StateAction(triggerName, onEntryAction as Function)
            this.entryActionsMap.set(stateName, onEntryStateAction)
          }
          break
        case StateMachine.ON_EXIT:
          this.exitAction = new StateAction(triggerName, triggerAction as Function)
          break
        default:
          this.triggers.push(new StateTrigger(triggerName, triggerAction))
          break
      }
    }
  }

  public getTriggerNames(): string[] {
    return this.triggers.map((event: StateTrigger) => event.name)
  }

  onEnter(scope: any): void {
    if (this.enterAction) {
      this.enterAction.exec(scope)
    }
  }

  onEntryFrom(state: string, scope: any): void {
    if (!this.entryActionsMap.has(state)) {
      return
    }

    const stateAction = this.entryActionsMap.get(state)
    stateAction!.exec(scope)
  }

  onExit(scope: any): void {
    if (this.exitAction) {
      this.exitAction.exec(scope)
    }
  }
}

class StateMachine {
  static STATES: string = 'states'
  static STARTING_STATE: string = 'starting-state'

  static ON_EXIT: string = 'onExit'
  static ON_ENTER: string = 'onEnter'
  static ON_ENTRY_FROM: string = 'onEntryFrom'

  public previousStateName: string | undefined
  public stateName: string = ''
  private states: Map<string, State>

  [key: string]: any

  constructor(description: IStateMachineDescription) {
    const startingStateName: string = description[StateMachine.STARTING_STATE] as string
    const RESERVED: string[] = [StateMachine.STARTING_STATE, StateMachine.STATES]
    const propertiesAndMethods = Object.keys(description).filter(
      property => !RESERVED.includes(property)
    )
    for (const property of propertiesAndMethods) {
      this[property] = description[property] as Object
    }

    this.states = new Map<string, State>()
    for (const [stateName, triggers] of Object.entries(description[
      StateMachine.STATES
    ] as Object)) {
      this.states.set(stateName, new State(stateName, triggers as Object))
    }

    this.setState(startingStateName)
  }

  public getState(): State {
    return this.states.get(this.stateName)!
  }

  public getTriggerNames(): string[] {
    return this.getState()!.getTriggerNames()
  }

  public getAllStatesNames(): string[] {
    return [...this.states.keys()]
  }

  public setState(stateName: string): void {
    const currentState = this.getState()
    const prototype = Object.getPrototypeOf(this)
    if (currentState) {
      currentState.onExit(this)

      for (const { name } of currentState.triggers) {
        if (prototype.hasOwnProperty(name)) {
          delete prototype[name]
        }
      }
    }

    // Set the new state
    this.previousStateName = this.stateName
    this.stateName = stateName

    const state = this.getState()
    for (const event of state.triggers) {
      prototype[event.name] = function(...args: any[]) {
        event.call(this, ...args)
      }
    }

    state.onEnter(this)
    state.onEntryFrom(this.previousStateName, this)
  }
}

export { StateMachine, StateTransition, IStateMachineDescription }
