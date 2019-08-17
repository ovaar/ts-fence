[![Build Status](https://travis-ci.org/hmasr/ts-fence.svg?branch=master)](https://travis-ci.org/hmasr/ts-fence)
[![Coverage Status](https://coveralls.io/repos/github/hmasr/ts-fence/badge.svg?branch=master)](https://coveralls.io/github/hmasr/ts-fence?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![npm version](https://img.shields.io/npm/v/ts-fence)](https://www.npmjs.com/package/ts-fence 'View this project on npm')

> The descriptive statemachine for typescript

```sh
$ npm i -D ts-fence
```

```typescript
import { StateMachine, StateTransition, IStateMachineDescription } from 'ts-fence'

interface IPlayer {
  health: number
}

interface PlayerStateMachineDescription extends IStateMachineDescription {
  player: IPlayer
}

const player: IPlayer = {
  health: 100
}

const _description: PlayerStateMachineDescription = {
  player,
  [StateMachine.STARTING_STATE]: 'idle',
  [StateMachine.STATES]: {
    // describe states here
    idle: {
      // describe state triggers and actions here
      stabbed({ scope, stateMachine }: { scope: PlayerStateMachineDescription, stateMachine: StateMachine }, damage: number) {
        scope.player.health = scope.player.health - damage < 0 ? 0 : scope.player.health - damage;

        if (scope.player.health === 0) {
          stateMachine.die()
        }
      },
      die: new StateTransition('game-over', (): any => undefined),
    },
    'game-over': {
      ...
    }
  }
}
```
