import GLBuffer, { AttributeInfo } from '../gl/GLBuffer.js'
import { gl } from '../gl/GLUtilities.js'
import Shader from '../gl/Shader.js'
import Matrix4x4 from '../math/Matrix4x4.js'
import Material from './Material.js'
import MaterialManager from './MaterialManager.js'
import Vertex from './Vertex.js'

export default class Sprite {
  protected _name: string
  protected _width: number
  protected _height: number

  protected _buffer: GLBuffer
  protected _materialName: string
  protected _material: Material
  protected _vertices: Vertex[] = []

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
    this._buffer = new GLBuffer()

    const positionAttribute = new AttributeInfo()
    positionAttribute.location = 0
    positionAttribute.size = 3

    this._buffer.addAttributeLocation(positionAttribute)

    const texCoordAttribute = new AttributeInfo()
    texCoordAttribute.location = 1
    texCoordAttribute.size = 2

    this._buffer.addAttributeLocation(texCoordAttribute)

    // x, y, z, u, v
    // prettier-ignore
    this._vertices = [
      new Vertex(0.0, 0.0, 0.0, 0.0, 0.0),
      new Vertex(0.0, this._height, 0.0, 0.0, 1.0),
      new Vertex(this._width, this._height, 0.0, 1.0, 1.0),

      new Vertex(this._width, this._height, 0.0, 1.0, 1.0),
      new Vertex(this._width, 0.0, 0.0, 1.0, 0.0),
      new Vertex(0.0, 0.0, 0.0, 0.0, 0.0)
    ]

    for (let vertex of this._vertices) {
      this._buffer.pushBackData(vertex.toArray())
    }

    this._buffer.upload()
    this._buffer.unbind()
  }

  update(time: number): void {}

  draw(shader: Shader, model: Matrix4x4): void {
    const modelLocation = shader.getUniformLocation('u_model')
    gl.uniformMatrix4fv(modelLocation, false, model.toFloat32Array())

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
