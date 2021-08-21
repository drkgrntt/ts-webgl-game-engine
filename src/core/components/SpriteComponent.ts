import Shader from '../gl/Shader.js'
import Sprite from '../graphics/Sprite.js'
import BaseComponent from './BaseComponent.js'
import ComponentManager from './ComponentManager.js'
import IComponent from './IComponent.js'
import IComponentBuilder from './IComponentBuilder.js'
import IComponentData from './IComponentData.js'

export class SpriteComponentData implements IComponentData {
  name: string = ''
  materialName: string = ''

  setFromJson(json: any): void {
    if (json.name !== undefined) {
      this.name = String(json.name)
    }

    if (json.materialName !== undefined) {
      this.materialName = String(json.materialName)
    }
  }
}

export class SpriteComponentBuilder implements IComponentBuilder {
  get type(): string {
    return 'sprite'
  }

  buildFromJson(json: any): IComponent {
    const data = new SpriteComponentData()
    data.setFromJson(json)
    return new SpriteComponent(data)
  }
}

export default class SpriteComponent extends BaseComponent {
  private _sprite: Sprite

  constructor(data: SpriteComponentData) {
    super(data)

    this._sprite = new Sprite(data.name, data.materialName)
  }

  load(): void {
    this._sprite.load()
  }

  render(shader: Shader) {
    this._sprite.draw(shader, this.owner.worldMatrix)
    super.render(shader)
  }
}

ComponentManager.registerBuilder(new SpriteComponentBuilder())
