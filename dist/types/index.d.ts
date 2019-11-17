interface IStateNode {
    name: string;
}
declare type TriggerAction = Function | StateTransition;
interface IStateMachineDescription {
    [key: string]: Object | string | TriggerAction;
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
    constructor(name: string, action: TriggerAction);
    call(stateMachine: StateMachine, ...args: any[]): any;
}
declare class State implements IStateNode {
    name: string;
    triggers: StateTrigger[];
    private enterAction;
    private entryActionsMap;
    private exitAction;
    constructor(name: string, triggersDescription: object);
    getTriggerNames(): string[];
    onEnter(scope: any): void;
    onEntryFrom(state: string, scope: any): void;
    onExit(scope: any): void;
}
declare class StateMachine {
    static STATES: string;
    static STARTING_STATE: string;
    static ON_EXIT: string;
    static ON_ENTER: string;
    static ON_ENTRY_FROM: string;
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
