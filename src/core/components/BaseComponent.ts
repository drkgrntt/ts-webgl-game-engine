import Shader from '../gl/Shader.js'
import SimObject from '../world/SimObject.js'

export default abstract class BaseComponent {
  protected _owner: SimObject
  name: string

  constructor(name: string) {
    this.name = name
  }

  get owner(): SimObject {
    return this._owner
  }

  setOwner(owner: SimObject) {
    this._owner = owner
  }

  load(): void {}

  update(time: number): void {}

  render(shader: Shader): void {}
}
