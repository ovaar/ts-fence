declare let describe: jest.Describe
declare let it: jest.It
declare let expect: jest.Expect

import { StateMachine, StateTransition, IStateMachineDescription } from '../src'

interface BankStateMachineDescription extends IStateMachineDescription {
  balance: number
}

const description: BankStateMachineDescription = {
  balance: 0,
  [StateMachine.STARTING_STATE]: 'open',
  [StateMachine.STATES]: {
    open: {
      deposit({ scope }: { scope: BankStateMachineDescription }, amount: number) {
        scope.balance += amount
      },
      withdraw({ scope }: { scope: BankStateMachineDescription }, amount: number) {
        scope.balance -= amount
      },
      placeHold: new StateTransition('held', (): any => undefined),
      close: new StateTransition('closed', function({
        scope
      }: {
        scope: BankStateMachineDescription
      }) {
        if (scope.balance > 0) {
          // ...transfer balance to suspension account
        }
      })
    },
    held: {
      removeHold: new StateTransition('open', (): any => undefined),
      deposit({ scope }: { scope: BankStateMachineDescription }, amount: number) {
        scope.balance += amount
      },
      close: new StateTransition('closed', function({
        scope
      }: {
        scope: BankStateMachineDescription
      }) {
        if (scope.balance > 0) {
          // ...transfer balance to suspension account
        }
      })
    },
    closed: {
      reopen: new StateTransition('open', function() {
        // ...restore balance if applicable
      })
    }
  }
}

describe('Testing StateMachine', () => {
  it('should be able to create a new instance of StateMachine successfully', () => {
    const statemachine = new StateMachine(description)
    expect(statemachine).toBeInstanceOf(StateMachine)
  })

  it('should be able to deposit an amount succesfully', () => {
    const statemachine = new StateMachine(description)
    statemachine.deposit(5)

    const scope = (statemachine as unknown) as BankStateMachineDescription
    expect(scope.balance).toBe(5)
  })

  it('should be able to withdraw an amount succesfully', () => {
    const statemachine = new StateMachine(description)
    statemachine.withdraw(5)

    const scope = (statemachine as unknown) as BankStateMachineDescription
    expect(scope.balance).toBe(-5)
  })

  it('should be able to close an account succesfully', () => {
    const statemachine = new StateMachine(description)
    statemachine.close()

    expect(statemachine.previousStateName).toBe('open')
    expect(statemachine.stateName).toBe('closed')
  })

  it('should be able to reopen an account succesfully', () => {
    const statemachine = new StateMachine(description)

    statemachine.close()
    statemachine.reopen()

    expect(statemachine.previousStateName).toBe('closed')
    expect(statemachine.stateName).toBe('open')
  })
})
