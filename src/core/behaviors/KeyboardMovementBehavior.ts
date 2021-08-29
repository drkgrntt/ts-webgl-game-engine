import InputManager, { Keys } from '../input/InputManager.js'
import BaseBehavior from './BaseBehavior.js'
import BehaviorManager from './BehaviorManager.js'
import IBehavior from './IBehavior.js'
import IBehaviorBuilder from './IBehaviorBuilder.js'
import IBehaviorData from './IBehaviorData.js'

export class KeyboardMovementBehaviorData implements IBehaviorData {
  name: string
  speed: number = 0.1

  setFromJson(json: any): void {
    if (!json.name) {
      throw new Error('Name must be defined in behavior data')
    }
    this.name = String(json.name)

    if (json.speed !== undefined) {
      this.speed = Number(json.speed)
    }
  }
}

export class KeyboardMovementBehaviorBuilder
  implements IBehaviorBuilder
{
  get type(): string {
    return 'keyboardMovement'
  }

  buildFromJson(json: any): IBehavior {
    const data = new KeyboardMovementBehaviorData()
    data.setFromJson(json)
    return new KeyboardMovementBehavior(data)
  }
}

export default class KeyboardMovementBehavior extends BaseBehavior {
  speed: number

  constructor(data: KeyboardMovementBehaviorData) {
    super(data)
    this.speed = data.speed
  }

  update(time: number): void {
    if (InputManager.isKeyDown(Keys.LEFT, Keys.A)) {
      this._owner.transform.position.x -= this.speed
    }

    if (InputManager.isKeyDown(Keys.RIGHT, Keys.D)) {
      this._owner.transform.position.x += this.speed
    }

    if (InputManager.isKeyDown(Keys.UP, Keys.W)) {
      this._owner.transform.position.y -= this.speed
    }

    if (InputManager.isKeyDown(Keys.DOWN, Keys.S)) {
      this._owner.transform.position.y += this.speed
    }

    super.update(time)
  }
}

BehaviorManager.registerBuilder(new KeyboardMovementBehaviorBuilder())
