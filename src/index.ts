import {StateMachine} from './statemachine';

class AccountStateMachine extends StateMachine {

  balance : number = 0;

  constructor() {
    super();

    this.setDescription({
      [this.STARTING_STATE]: 'open',
      [this.STATES]: {
        'open': {
          'deposit' (amount: number) {
            console.log(`Add balance ${amount}`, this);
            this.balance = this.balance + amount; 
          },
          'withdraw' (amount: number) { this.balance = this.balance - amount; },
          'placeHold': this.transitionsTo('held', () : any => undefined),
          'close': this.transitionsTo('closed', function () {
            if (this.balance > 0) {
              // ...transfer balance to suspension account
            }
          })
        },
        'held': {
          'removeHold': this.transitionsTo('open', () : any => undefined),
          'deposit' (amount: number) { this.balance = this.balance + amount; },
          'close': this.transitionsTo('closed', function () {
            if (this.balance > 0) {
              // ...transfer balance to suspension account
            }
          })
        },
        'closed': {
          'reopen': this.transitionsTo('open', function () {
            // ...restore balance if applicable
          })
        }
      }
    });

    // console.log(this);
  }
}

const accountMachine = new AccountStateMachine();
console.log(accountMachine.getState().deposit(10));
// console.log('CURRENTSTATE=',accountMachine.getStateName());
// console.log('STATE=',accountMachine.getState());

// accountMachine.getState().deposit(10);

// console.log(accountMachine.balance)