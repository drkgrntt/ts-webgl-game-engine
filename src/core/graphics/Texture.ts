import AssetManager, {
  MESSAGE_ASSET_LOADER_ASSET_LOADED,
} from '../assets/AssetManager.js'
import { ImageAsset } from '../assets/ImageAssetLoader.js'
import { gl } from '../gl/GLUtilities.js'
import IMessageHandler from '../message/IMessageHandler.js'
import Message from '../message/Message.js'

const LEVEL: number = 0
const BORDER: number = 0
const TEMP_IMAGE_DATA: Uint8Array = new Uint8Array([
  255, 255, 255, 255,
])

export default class Texture implements IMessageHandler {
  private _name: string
  private _handle: WebGLTexture
  private _isLoaded: boolean = false
  private _width: number
  private _height: number

  constructor(name: string, width: number = 1, height: number = 1) {
    this._name = name
    this._width = width
    this._height = height

    const handle = gl.createTexture()
    if (!handle) {
      throw new Error('Unable to create a WebGL texture')
    }
    this._handle = handle

    Message.subscribe(
      MESSAGE_ASSET_LOADER_ASSET_LOADED + this.name,
      this
    )

    this.bind()

    gl.texImage2D(
      gl.TEXTURE_2D,
      LEVEL,
      gl.RGBA,
      1,
      1,
      BORDER,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      TEMP_IMAGE_DATA
    )

    const asset = AssetManager.getAsset(this.name) as ImageAsset
    if (asset) {
      this.loadTextureFromAsset(asset)
    }
  }

  get name(): string {
    return this._name
  }

  get isLoaded(): boolean {
    return this._isLoaded
  }

  get width(): number {
    return this._width
  }

  get height(): number {
    return this._height
  }

  destroy(): void {
    gl.deleteTexture(this._handle)
  }

  activateAndBind(textureUnit: number = 0): void {
    gl.activeTexture(gl.TEXTURE0 + textureUnit)
    this.bind()
  }

  bind(): void {
    gl.bindTexture(gl.TEXTURE_2D, this._handle)
  }

  unbind(): void {
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  onMessage(message: Message) {
    if (
      message.code ===
      MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name
    ) {
      this.loadTextureFromAsset(message.context as ImageAsset)
    }
  }

  private loadTextureFromAsset(asset: ImageAsset): void {
    this._width = asset.width
    this._height = asset.height

    this.bind()

    gl.texImage2D(
      gl.TEXTURE_2D,
      LEVEL,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      asset.data
    )

    if (this.isPowerOf2()) {
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      // Do not generate a mip map and clamp wrapping to edge
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_S,
        gl.CLAMP_TO_EDGE
      )
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T,
        gl.CLAMP_TO_EDGE
      )
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR
      )
    }

    this._isLoaded = true
  }

  private isPowerOf2(): boolean {
    return (
      this.isValuePowerOf2(this._width) &&
      this.isValuePowerOf2(this._height)
    )
  }

  private isValuePowerOf2(value: number): boolean {
    return Math.log2(value) % 1 === 0
  }
}
