import GLBuffer, { AttributeInfo } from '../gl/GLBuffer.js'
import { gl } from '../gl/GLUtilities.js'
import Shader from '../gl/Shader.js'
import Vector3 from '../math/Vector3.js'
import Texture from './Texture.js'
import TextureManager from './TextureManager.js'

export default class Sprite {
  private _name: string
  private _width: number
  private _height: number

  private _buffer: GLBuffer
  private _textureName: string
  private _texture: Texture

  position: Vector3 = new Vector3()

  constructor(
    name: string,
    textureName: string,
    width: number = 100,
    height: number = 100
  ) {
    this._name = name
    this._textureName = textureName
    this._width = width
    this._height = height
    this._texture = TextureManager.getTexture(this._textureName)
  }

  get name(): string {
    return this._name
  }

  destroy(): void {
    this._buffer.destroy()
    TextureManager.releaseTexture(this._textureName)
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
    this._texture.activateAndBind(0)
    const diffuseLocation = shader.getUniformLocation('u_diffuse')
    gl.uniform1i(diffuseLocation, 0)

    this._buffer.bind()
    this._buffer.draw()
  }
}
