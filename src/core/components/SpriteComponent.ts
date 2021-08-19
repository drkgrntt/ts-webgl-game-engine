import Shader from '../gl/Shader.js'
import Sprite from '../graphics/Sprite.js'
import BaseComponent from './BaseComponent.js'

export default class SpriteComponent extends BaseComponent {
  private _sprite: Sprite

  constructor(name: string, materialName: string) {
    super(name)

    this._sprite = new Sprite(name, materialName)
  }

  load(): void {
    this._sprite.load()
  }

  render(shader: Shader) {
    this._sprite.draw(shader, this.owner.worldMatrix)
    super.render(shader)
  }
}
