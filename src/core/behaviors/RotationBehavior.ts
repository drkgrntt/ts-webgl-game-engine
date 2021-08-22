import Vector3 from '../math/Vector3.js'
import BaseBehavior from './BaseBehavior.js'
import BehaviorManager from './BehaviorManager.js'
import IBehavior from './IBehavior.js'
import IBehaviorBuilder from './IBehaviorBuilder.js'
import IBehaviorData from './IBehaviorData.js'

export class RotationBehaviorData implements IBehaviorData {
  name: string
  rotation: Vector3 = Vector3.zero

  setFromJson(json: any): void {
    if (!json.name) {
      throw new Error('Name must be defined in behavior data')
    }
    this.name = String(json.name)

    if (json.rotation) {
      this.rotation.setFromJson(json.rotation)
    }
  }
}

export class RotationBehaviorBuilder implements IBehaviorBuilder {
  get type(): string {
    return 'rotation'
  }

  buildFromJson(json: any): IBehavior {
    const data = new RotationBehaviorData()
    data.setFromJson(json)
    return new RotationBehavior(data)
  }
}

export default class RotationBehavior extends BaseBehavior {
  private _rotation: Vector3

  constructor(data: RotationBehaviorData) {
    super(data)

    this._rotation = data.rotation
  }

  update(time: number): void {
    this._owner.transform.rotation.add(this._rotation)

    super.update(time)
  }
}

BehaviorManager.registerBuilder(new RotationBehaviorBuilder())
