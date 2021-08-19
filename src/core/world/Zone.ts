import Shader from '../gl/Shader.js'
import Scene from './Scene.js'

export enum ZoneState {
  UNINITIALIZED,
  LOADING,
  UPDATING,
}

export default class Zone {
  private _id: number
  private _name: string
  private _description: string
  private _scene: Scene
  private _state: ZoneState = ZoneState.UNINITIALIZED

  constructor(id: number, name: string, description: string) {
    this._id = id
    this._name = name
    this._description = description
    this._scene = new Scene()
  }

  get id(): number {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get description(): string {
    return this._description
  }

  get scene(): Scene {
    return this._scene
  }

  load(): void {
    this._state = ZoneState.LOADING

    this._scene.load()

    this._state = ZoneState.UPDATING
  }

  unload(): void {}

  update(time: number): void {
    if (this._state === ZoneState.UPDATING) {
      this._scene.update(time)
    }
  }

  render(shader: Shader): void {
    if (this._state === ZoneState.UPDATING) {
      this._scene.render(shader)
    }
  }

  onActivated(): void {}

  onDeactivated(): void {}
}
