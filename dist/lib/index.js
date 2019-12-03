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
        args.unshift({ scope: stateMachine, stateMachine });
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
class StateAction {
    constructor(name, action) {
        this.name = name;
        this._action = action;
    }
    exec(stateMachine) {
        this._action.call(stateMachine, { scope: stateMachine, stateMachine });
    }
}
class State {
    constructor(name, triggersDescription) {
        this.triggers = [];
        this.enterAction = undefined;
        this.entryActionsMap = new Map();
        this.exitAction = undefined;
        this.name = name;
        for (const [triggerName, triggerAction] of Object.entries(triggersDescription)) {
            if (typeof triggerAction === 'undefined') {
                throw new Error(`StateMachine: undefined reference ${triggerName} for state '${this.name}'`);
            }
            switch (triggerName) {
                case StateMachine.ON_ENTER:
                    this.enterAction = new StateAction(triggerName, triggerAction);
                    break;
                case StateMachine.ON_ENTRY_FROM:
                    for (const [stateName, onEntryAction] of Object.entries(triggerAction)) {
                        const onEntryStateAction = new StateAction(triggerName, onEntryAction);
                        this.entryActionsMap.set(stateName, onEntryStateAction);
                    }
                    break;
                case StateMachine.ON_EXIT:
                    this.exitAction = new StateAction(triggerName, triggerAction);
                    break;
                default:
                    this.triggers.push(new StateTrigger(triggerName, triggerAction));
                    break;
            }
        }
    }
    getTriggerNames() {
        return this.triggers.map((event) => event.name);
    }
    onEnter(scope) {
        if (this.enterAction) {
            this.enterAction.exec(scope);
        }
    }
    onEntryFrom(state, scope) {
        if (!this.entryActionsMap.has(state)) {
            return;
        }
        const stateAction = this.entryActionsMap.get(state);
        stateAction.exec(scope);
    }
    onExit(scope) {
        if (this.exitAction) {
            this.exitAction.exec(scope);
        }
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
            currentState.onExit(this);
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
        state.onEnter(this);
        state.onEntryFrom(this.previousStateName, this);
    }
}
exports.StateMachine = StateMachine;
StateMachine.STATES = 'states';
StateMachine.STARTING_STATE = 'starting-state';
StateMachine.ON_EXIT = 'onExit';
StateMachine.ON_ENTER = 'onEnter';
StateMachine.ON_ENTRY_FROM = 'onEntryFrom';
//# sourceMappingURL=index.js.map