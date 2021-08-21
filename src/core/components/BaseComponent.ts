import Shader from '../gl/Shader.js'
import SimObject from '../world/SimObject.js'
import IComponent from './IComponent.js'
import IComponentData from './IComponentData.js'

export default abstract class BaseComponent implements IComponent {
  protected _owner: SimObject
  protected _data: IComponentData
  name: string

  constructor(data: IComponentData) {
    this._data = data
    this.name = data.name
  }

  get owner(): SimObject {
    return this._owner
  }

  setOwner(owner: SimObject) {
    this._owner = owner
  }

  load(): void {}

  unload(): void {}

  update(time: number): void {}

  render(shader: Shader): void {}
}
