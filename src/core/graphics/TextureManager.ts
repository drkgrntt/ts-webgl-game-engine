import Texture from './Texture.js'

class TextureReferenceNode {
  texture: Texture
  referenceCount: number = 1

  constructor(texture: Texture) {
    this.texture = texture
  }
}

export default class TextureManager {
  private static _textures: Record<string, TextureReferenceNode> = {}

  private constructor() {}

  static getTexture(textureName: string): Texture {
    if (!TextureManager._textures[textureName]) {
      const texture = new Texture(textureName)
      TextureManager._textures[textureName] =
        new TextureReferenceNode(texture)
    } else {
      TextureManager._textures[textureName].referenceCount++
    }

    return TextureManager._textures[textureName].texture
  }

  static releaseTexture(textureName: string): void {
    if (!TextureManager._textures[textureName]) {
      console.warn(
        `A texture named ${textureName} does not exist and cannot be released`
      )
      return
    }

    TextureManager._textures[textureName].referenceCount--
    if (TextureManager._textures[textureName].referenceCount < 1) {
      TextureManager._textures[textureName].texture.destroy()
      delete TextureManager._textures[textureName]
    }
  }
}
