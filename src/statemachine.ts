'use strict';
import { EventEmitter } from  'events';

interface IStateNode {
  name : string;
}

class StateAction {
  constructor(public method: Function) {}
}

class StateTransition extends StateAction {
  public stateName: string;
  constructor(stateName: string, fn: Function) {
    super(
      function transitionTo(...args: any[]) {
        const returnValue = fn.apply(this, args);
        this.setState(stateName);
        return returnValue;
      }
    );
    this.stateName = stateName;
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
  public eventNames: string[] = [];

  constructor(name: string, eventsDescription: object) {
    this.name = name;
    for (const [eventName, action] of Object.entries(eventsDescription)) {
      this.eventNames.push(eventName);
      this.events.push(new StateEvent(eventName, action));
    }
  }

  public getEventNames() : string[] {
    return this.events.map((event: StateEvent) => event.name);
  }
}

class StateMachine extends EventEmitter {

  static STATE : symbol = Symbol("state");
  static STATES : symbol = Symbol("states");
  static STARTING_STATE : symbol = Symbol("starting-state");

  private stateName: string;
  private states: Map<string, State>;
  
  [key: string]: any;

  constructor(description: any) {
    super();

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

  public getState() : State {
    return this.states.get(this.stateName);
  }

  public getStateName() : string {
    return this.stateName;
  }

  public getEventNames() : string[] {
    return this.getState().getEventNames();
  }

  public getAllStatesNames() : string[] {
    return [...this.states.keys()];
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

    this.emit('transition', this.stateName);
  }
}

export { StateMachine, StateTransition };