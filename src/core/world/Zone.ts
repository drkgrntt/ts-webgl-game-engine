import ComponentManager from '../components/ComponentManager.js'
import Shader from '../gl/Shader.js'
import Scene from './Scene.js'
import SimObject from './SimObject.js'

export enum ZoneState {
  UNINITIALIZED,
  LOADING,
  UPDATING,
}

export default class Zone {
  private _id: number
  private _name: string
  private _description?: string
  private _scene: Scene
  private _state: ZoneState = ZoneState.UNINITIALIZED
  private _globalId: number = -1

  constructor(id: number, name: string, description?: string) {
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

  get description(): string | void {
    return this._description
  }

  get scene(): Scene {
    return this._scene
  }

  initialize(zoneData: any): void {
    if (!Array.isArray(zoneData.objects)) {
      throw new Error(
        `Zone initialization error: objects not present or not an array`
      )
    }

    for (let o in zoneData.objects) {
      this.loadSimObject(zoneData.objects[o], this._scene.root)
    }
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

  private loadSimObject(dataSection: any, parent: SimObject): void {
    let name: string = ''
    if (dataSection.name !== undefined) {
      name = String(dataSection.name)
    }

    this._globalId++
    const simObject = new SimObject(this._globalId, name, this._scene)

    if (dataSection.transform) {
      simObject.transform.setFromJson(dataSection.transform)
    }

    if (Array.isArray(dataSection.components)) {
      for (let c in dataSection.components) {
        const component = ComponentManager.extractComponent(
          dataSection.components[c]
        )
        simObject.addComponent(component)
      }
    }

    if (Array.isArray(dataSection.children)) {
      for (let o in dataSection.children) {
        this.loadSimObject(dataSection.children[o], simObject)
      }
    }

    parent.addChild(simObject)
  }
}
