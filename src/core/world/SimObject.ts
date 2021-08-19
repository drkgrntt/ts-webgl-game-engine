import BaseComponent from '../components/BaseComponent.js'
import Shader from '../gl/Shader.js'
import Matrix4x4 from '../math/Matrix4x4.js'
import Transform from '../math/Transform.js'
import Scene from './Scene.js'

export default class SimObject {
  private _id: number
  private _children: SimObject[] = []
  private _parent: SimObject
  private _isLoaded: boolean = false
  private _scene: Scene
  private _components: BaseComponent[] = []

  private _localMatrix: Matrix4x4 = Matrix4x4.identity()
  private _worldMatrix: Matrix4x4 = Matrix4x4.identity()

  name: string
  transform: Transform = new Transform()

  constructor(id: number, name: string, scene?: Scene) {
    this._id = id
    this.name = name
    if (scene) {
      this._scene = scene
    }
  }

  get id(): number {
    return this._id
  }

  get parent(): SimObject {
    return this._parent
  }

  get worldMatrix(): Matrix4x4 {
    return this._worldMatrix
  }

  get isLoaded(): boolean {
    return this._isLoaded
  }

  addChild(child: SimObject): void {
    child._parent = this
    this._children.push(child)
    child.onAdded(this._scene)
  }

  removeChild(child: SimObject): void {
    const index = this._children.indexOf(child)
    if (index !== -1) {
      // @ts-ignore
      child._parent = undefined
      this._children.splice(index, 1)
    }
  }

  getObjectByName(name: string): SimObject | void {
    if (this.name === name) {
      return this
    }

    for (let child of this._children) {
      const result = child.getObjectByName(name)
      if (result) {
        return result
      }
    }
  }

  addComponent(component: BaseComponent) {
    this._components.push(component)
    component.setOwner(this)
  }

  load(): void {
    this._isLoaded = true

    for (let component of this._components) {
      component.load()
    }

    for (let child of this._children) {
      child.load()
    }
  }

  update(time: number): void {
    this._localMatrix = this.transform.getTransformationMatrix()
    this.updateWorldMatrix(
      this._parent ? this._parent._worldMatrix : undefined
    )

    for (let component of this._components) {
      component.update(time)
    }

    for (let child of this._children) {
      child.update(time)
    }
  }

  render(shader: Shader): void {
    for (let component of this._components) {
      component.render(shader)
    }

    for (let child of this._children) {
      child.render(shader)
    }
  }

  protected onAdded(scene: Scene): void {
    this._scene = scene
  }

  private updateWorldMatrix(parentWorldMatrix?: Matrix4x4): void {
    if (parentWorldMatrix) {
      this._worldMatrix = Matrix4x4.multiply(
        parentWorldMatrix,
        this._localMatrix
      )
    } else {
      this._worldMatrix.copyFrom(this._localMatrix)
    }
  }
}
