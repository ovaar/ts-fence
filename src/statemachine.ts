'use strict';

export class StateMachine {
  public STATE : Symbol = Symbol("state");
  public STATES : Symbol = Symbol("states");
  public STARTING_STATE : Symbol = Symbol("starting-state");
  public machine : object = {};

  constructor() {
    
  }

  protected setDescription(description: object) {
    const RESERVED: Symbol[] = [this.STARTING_STATE, this.STATES];

    // Handle all the initial states and/or methods
    const propertiesAndMethods = Object.keys(description).filter(property => !RESERVED.includes(property));
    for (const property of propertiesAndMethods) {
      this.machine[property] = description[property];
    }

    // now its states
    this.machine[this.STATES] = description[this.STATES];

    // what event handlers does it have?
    const eventNames = Object.entries(description[this.STATES]).reduce(
      (eventNames, [state, stateDescription]) => {
        const eventNamesForThisState = Object.keys(stateDescription);

        for (const eventName of eventNamesForThisState) {
          eventNames.add(eventName);
        }
        return eventNames;
        },
        new Set()
    );
    console.log(eventNames)

    // define the delegating methods
    for (const eventName of eventNames) {
      this.machine[eventName] = function (...args: any[]) {
        const handler = this[this.STATE][eventName];
        
        if (typeof handler === 'function') {
          return this[this.STATE][eventName].apply(this, args);
        } else {
          throw `invalid event ${eventName}`;
        }
      }

      console.log(this.machine[eventName].toString())
    }

    // set the starting state
    this.machine[this.STATE] = description[this.STATES][description[this.STARTING_STATE]];
    this.machine[this.STATE].name = description[this.STARTING_STATE];

    // we're done
  }

  protected transitionsTo (stateName, fn) {
    return function (...args: any[]) {
      const returnValue = fn.apply(this, args);
      this[this.STATE] = this[this.STATES][stateName];
      this[this.STATE].name = stateName;

      return returnValue;
    };
  }

  public getState(): object {
    return this.machine[this.STATE];
  }

  public getStateName(): string {
    return this.getState().name;
  }
}
