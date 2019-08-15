interface IStateNode {
    name: string;
}
declare type StateAction = Function | StateTransition;
interface IStateMachineDescription {
    [key: string]: Object | string | StateAction;
}
declare class StateTransition {
    stateName: string;
    operation: Function;
    constructor(stateName: string, fn: Function);
    transition(scope: StateMachine): void;
}
declare class StateTrigger implements IStateNode {
    name: string;
    private _action;
    constructor(name: string, action: StateAction);
    call(stateMachine: StateMachine, ...args: any[]): any;
}
declare class State implements IStateNode {
    name: string;
    triggers: StateTrigger[];
    constructor(name: string, triggersDescription: object);
    getTriggerNames(): string[];
}
declare class StateMachine {
    static STATES: string;
    static STARTING_STATE: string;
    previousStateName: string | undefined;
    stateName: string;
    private states;
    [key: string]: any;
    constructor(description: IStateMachineDescription);
    getState(): State;
    getTriggerNames(): string[];
    getAllStatesNames(): string[];
    setState(stateName: string): void;
}
export { StateMachine, StateTransition, IStateMachineDescription };
