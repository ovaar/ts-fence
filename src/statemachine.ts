'use strict';

interface IStateNode {
  name : string;
}

class StateAction {
  constructor(public method: Function) {}
}

class StateTransition extends StateAction {
  constructor(stateName: string, fn: Function) {
    super(
      function transitionTo(...args: any[]) {
        const returnValue = fn.apply(this, args);
        this.setState(stateName);
        return returnValue;
      }
    );
  }
}

class StateEvent implements IStateNode {
  
  public name : string;
  public action : StateAction;

  constructor(name: string, action: any) {
    this.name = name;

    if (action instanceof StateAction) {
      this.action = action;
    } else {
      this.action = new StateAction(action);
    }

  }
}

class State implements IStateNode {
  
  public name : string;
  public events: StateEvent[] = [];

  constructor(name: string, eventsDescription: object) {
    this.name = name;
    for (const [eventName, action] of Object.entries(eventsDescription)) {
      this.events.push(new StateEvent(eventName, action));
    }
  }
}

class StateMachine {

  static STATE : symbol = Symbol("state");
  static STATES : symbol = Symbol("states");
  static STARTING_STATE : symbol = Symbol("starting-state");

  public stateName: string;
  private states: Map<string, State>;

  constructor(description: any) {

    const RESERVED: symbol[] = [StateMachine.STARTING_STATE, StateMachine.STATES];
    const propertiesAndMethods = Object.keys(description).filter(property => !RESERVED.includes(property));
    for (const property of propertiesAndMethods) {
      this[property] = description[property];
    }

    this.states = new Map<string, State>();
    for (const [stateName, events] of Object.entries(description[StateMachine.STATES])) {
      this.states.set(stateName, new State(stateName, events));
    }

    this.stateName = description[StateMachine.STARTING_STATE];

    this.setState(this.stateName);
  }

  getState() {
    return this.states.get(this.stateName);
  }

  private setState (stateName: string) : void {
    const currentState = this.getState();
    for (const { name } of currentState.events) {
      if (typeof this.__proto__[name] === 'function') {
        delete this.__proto__[name];
      }
    }

    // Set the new state
    this.stateName = stateName;

    const state = this.getState();
    for (const { name, action } of state.events) {
      this.__proto__[name] = action.method.bind(this);
    }    
  }
}

export { StateMachine };
export { StateTransition };