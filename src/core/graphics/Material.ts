import Color from './Color.js'
import Texture from './Texture.js'
import TextureManager from './TextureManager.js'

export default class Material {
  private _name: string
  private _diffuseTextureName: string

  private _diffuseTexture: Texture
  private _tint: Color

  constructor(name: string, diffuseTextureName: string, tint: Color) {
    this._name = name
    this._diffuseTextureName = diffuseTextureName
    this._tint = tint

    if (this._diffuseTextureName) {
      this._diffuseTexture = TextureManager.getTexture(
        this._diffuseTextureName
      )
    }
  }

  get name(): string {
    return this._name
  }

  get diffuseTextureName(): string {
    return this._diffuseTextureName
  }

  set diffuseTextureName(value: string) {
    if (this._diffuseTexture) {
      TextureManager.releaseTexture(this._diffuseTextureName)
    }

    this._diffuseTextureName = value

    if (this._diffuseTextureName) {
      this._diffuseTexture = TextureManager.getTexture(
        this._diffuseTextureName
      )
    }
  }

  get diffuseTexture(): Texture {
    return this._diffuseTexture
  }

  get tint(): Color {
    return this._tint
  }

  destroy(): void {
    TextureManager.releaseTexture(this.diffuseTextureName)

    // @ts-ignore
    this._diffuseTexture = undefined
  }
}
