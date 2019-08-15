'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class StateTransition {
    constructor(stateName, fn) {
        this.stateName = stateName;
        this.operation = fn;
    }
    transition(scope) {
        scope.setState(this.stateName);
    }
}
exports.StateTransition = StateTransition;
class StateTrigger {
    constructor(name, action) {
        this.name = name;
        this._action = action;
    }
    call(stateMachine, ...args) {
        let returnValue;
        args.unshift({ scope: stateMachine });
        if (this._action instanceof StateTransition) {
            returnValue = this._action.operation.apply(this, args);
            this._action.transition(stateMachine);
        }
        else {
            returnValue = this._action.apply(this, args);
        }
        return returnValue;
    }
}
class State {
    constructor(name, triggersDescription) {
        this.triggers = [];
        this.name = name;
        for (const [triggerName, triggerAction] of Object.entries(triggersDescription)) {
            this.triggers.push(new StateTrigger(triggerName, triggerAction));
        }
    }
    getTriggerNames() {
        return this.triggers.map((event) => event.name);
    }
}
class StateMachine {
    constructor(description) {
        this.stateName = '';
        const startingStateName = description[StateMachine.STARTING_STATE];
        const RESERVED = [StateMachine.STARTING_STATE, StateMachine.STATES];
        const propertiesAndMethods = Object.keys(description).filter(property => !RESERVED.includes(property));
        for (const property of propertiesAndMethods) {
            this[property] = description[property];
        }
        this.states = new Map();
        for (const [stateName, triggers] of Object.entries(description[StateMachine.STATES])) {
            this.states.set(stateName, new State(stateName, triggers));
        }
        this.setState(startingStateName);
    }
    getState() {
        return this.states.get(this.stateName);
    }
    getTriggerNames() {
        return this.getState().getTriggerNames();
    }
    getAllStatesNames() {
        return [...this.states.keys()];
    }
    setState(stateName) {
        const currentState = this.getState();
        const prototype = Object.getPrototypeOf(this);
        if (currentState) {
            for (const { name } of currentState.triggers) {
                if (prototype.hasOwnProperty(name)) {
                    delete prototype[name];
                }
            }
        }
        // Set the new state
        this.previousStateName = this.stateName;
        this.stateName = stateName;
        const state = this.getState();
        for (const event of state.triggers) {
            prototype[event.name] = function (...args) {
                event.call(this, ...args);
            };
        }
    }
}
StateMachine.STATES = 'states';
StateMachine.STARTING_STATE = 'starting-state';
exports.StateMachine = StateMachine;
//# sourceMappingURL=index.js.map