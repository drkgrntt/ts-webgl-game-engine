import Shader from '../gl/Shader.js'
import SimObject from './SimObject.js'

export default class Scene {
  private _root: SimObject

  constructor() {
    this._root = new SimObject(0, '__ROOT__', this)
  }

  get root(): SimObject {
    return this._root
  }

  get isLoaded(): boolean {
    return this._root.isLoaded
  }

  addObject(object: SimObject): void {
    this._root.addChild(object)
  }

  getObjectByName(name: string): SimObject | void {
    return this._root.getObjectByName(name)
  }

  load(): void {
    this._root.load()
  }

  update(time: number): void {
    this._root.update(time)
  }

  render(shader: Shader): void {
    this._root.render(shader)
  }
}
