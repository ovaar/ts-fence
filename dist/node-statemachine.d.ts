
export interface IStateNode {
    name : string;
}

export class StateAction {
    public method: Function;
    
    constructor(method: Function);
}

export declare class StateTransition extends StateAction {
    public stateName: string;
    constructor(stateName: string, fn: Function);
}

export declare class StateEvent implements IStateNode {
  
    public name : string;
    public action : StateAction;
  
    constructor(name: string, action: any);

}

export declare class State implements IStateNode {
  
    public name : string;
    public events: StateEvent[];
    public eventNames: string[];
  
    constructor(name: string, eventsDescription: object);

    public getEventNames() : string[];
}

export declare class StateMachine {
    static STATE : symbol;
    static STATES : symbol;
    static STARTING_STATE : symbol;

    private stateName: string;
    private states: Map<string, State>;

    /**
     * Creates a new instance of {@link StateMachine}
     * @param description StateMachine description object
     */
    constructor(description: any);

    [key: string]: any;

    public getState() : State;

    public getStateName() : string;

    public getEventNames() : string[];

    public getAllStatesNames() : string[];

    private setState (stateName: string) : void;
}