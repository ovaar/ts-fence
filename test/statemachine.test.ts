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
    expect(statemachine.stateName).toBe('open')
  })

  describe('Testing getAllStatesNames method', () => {
    it('should be able to get a list of all the state names succesfully', () => {
      const expected: string[] = ['open', 'held', 'closed']

      const statemachine = new StateMachine(description)

      const states: string[] = statemachine.getAllStatesNames()
      expect(states).toEqual(expect.arrayContaining(expected))
    })
  })

  describe('Testing getTriggerNames method', () => {
    it('should be able to get a list of all the state trigger names succesfully', () => {
      const expected: string[] = ['deposit', 'withdraw', 'placeHold', 'close']

      const statemachine = new StateMachine(description)

      const states: string[] = statemachine.getTriggerNames()
      expect(states).toEqual(expect.arrayContaining(expected))
    })
  })

  describe('Testing setState method', () => {
    it('should remove all triggers from the prototyped scope when changing state', () => {
      const statemachine = new StateMachine(description)
      const stateTriggerNames = statemachine.getTriggerNames()
      const prototype = Object.getPrototypeOf(statemachine)
      prototype.test1 = 'test1'
      expect(statemachine).toHaveProperty('close')
      expect(statemachine).toHaveProperty('test1')
      statemachine.close()
      expect(statemachine).not.toHaveProperty('close')
      expect(statemachine).toHaveProperty('test1')
    })

    it('should only remove existing triggers from the prototyped scope when changing state', () => {
      const statemachine = new StateMachine(description)
      const state = statemachine.getState() as any
      state.triggers.push({ name: 'test' })
      expect(statemachine).not.toHaveProperty('test')
      statemachine.close()
    })
  })

  it('should call the ON_ENTER state method succesfully', () => {
    const onEnterMockFn = jest.fn()
    const description: IStateMachineDescription = {
      [StateMachine.STARTING_STATE]: 'open',
      [StateMachine.STATES]: {
        open: {
          [StateMachine.ON_ENTER]: onEnterMockFn
        }
      }
    }
    const statemachine = new StateMachine(description)

    expect(statemachine.stateName).toBe('open')
    expect(onEnterMockFn).toBeCalled()
  })

  it('should call the ON_EXIT state method succesfully', () => {
    const onExitMockFn = jest.fn()
    const description: IStateMachineDescription = {
      [StateMachine.STARTING_STATE]: 'open',
      [StateMachine.STATES]: {
        open: {
          [StateMachine.ON_EXIT]: onExitMockFn,
          close: new StateTransition('closed', (): any => undefined)
        },
        closed: {}
      }
    }

    const statemachine = new StateMachine(description)
    statemachine.close()

    expect(statemachine.stateName).toBe('closed')
    expect(onExitMockFn).toBeCalled()
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
