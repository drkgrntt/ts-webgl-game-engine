import GLBuffer, { AttributeInfo } from '../gl/GLBuffer.js'
import { gl } from '../gl/GLUtilities.js'
import Shader from '../gl/Shader.js'
import Matrix4x4 from '../math/Matrix4x4.js'
import Vector3 from '../math/Vector3.js'
import Material from './Material.js'
import MaterialManager from './MaterialManager.js'

export default class Sprite {
  private _name: string
  private _width: number
  private _height: number

  private _buffer: GLBuffer
  private _materialName: string
  private _material: Material

  position: Vector3 = new Vector3()

  constructor(
    name: string,
    materialName: string,
    width: number = 100,
    height: number = 100
  ) {
    this._name = name
    this._materialName = materialName
    this._width = width
    this._height = height
    const material = MaterialManager.getMaterial(this._materialName)
    if (!material) {
      throw new Error(`Unable to get material ${this._materialName}`)
    }
    this._material = material
  }

  get name(): string {
    return this._name
  }

  destroy(): void {
    this._buffer.destroy()
    MaterialManager.releaseMaterial(this._materialName)

    // @ts-ignore
    this._material = undefined
  }

  load(): void {
    this._buffer = new GLBuffer(5)

    const positionAttribute = new AttributeInfo()
    positionAttribute.location = 0
    positionAttribute.offset = 0
    positionAttribute.size = 3

    this._buffer.addAttributeLocation(positionAttribute)

    const texCoordAttribute = new AttributeInfo()
    texCoordAttribute.location = 1
    texCoordAttribute.offset = 3
    texCoordAttribute.size = 2

    this._buffer.addAttributeLocation(texCoordAttribute)

    // x, y, z, u, v
    // prettier-ignore
    const vertices = [
      0.0, 0.0, 0.0, 0.0, 0.0,
      0.0, this._height, 0.0, 0.0, 1.0,
      this._width, this._height, 0.0, 1.0, 1.0,

      this._width, this._height, 0.0, 1.0, 1.0,
      this._width, 0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 0.0, 0.0
    ]

    this._buffer.pushBackData(vertices)
    this._buffer.upload()
    this._buffer.unbind()
  }

  update(time: number): void {}

  draw(shader: Shader): void {
    const modelLocation = shader.getUniformLocation('u_model')
    gl.uniformMatrix4fv(
      modelLocation,
      false,
      new Float32Array(Matrix4x4.translation(this.position).data)
    )

    const colorLocation = shader.getUniformLocation('u_tint')

    gl.uniform4fv(colorLocation, this._material.tint.toFloat32Array())

    if (this._material.diffuseTexture) {
      this._material.diffuseTexture.activateAndBind(0)
      const diffuseLocation = shader.getUniformLocation('u_diffuse')
      gl.uniform1i(diffuseLocation, 0)
    }

    this._buffer.bind()
    this._buffer.draw()
  }
}
