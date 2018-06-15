declare let it, expect;

import {StateMachine, StateTransition} from '../src/statemachine';

const description = {
    balance: 0,
    [StateMachine.STARTING_STATE]: 'open',
    [StateMachine.STATES]: {
      'open': {
        'deposit' (amount: number) {
          this.balance = this.balance + amount; 
          console.log(`Add balance ${amount}`, this);
        },
        'withdraw' (amount: number) { this.balance = this.balance - amount; },
        'placeHold': new StateTransition('held', () : any => undefined),
        'close': new StateTransition('closed', function () {
          if (this.balance > 0) {
            // ...transfer balance to suspension account
          }
        })
      },
      'held': {
        'removeHold': new StateTransition('open', () : any => undefined),
        'deposit' (amount: number) { this.balance = this.balance + amount; },
        'close': new StateTransition('closed', function () {
          if (this.balance > 0) {
            // ...transfer balance to suspension account
          }
        })
      },
      'closed': {
        'reopen': new StateTransition('open', function () {
          // ...restore balance if applicable
        })
      }
    }
};

it('should create a new StateMachine', () => {

    

});