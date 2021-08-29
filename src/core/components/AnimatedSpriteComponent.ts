import Shader from '../gl/Shader.js'
import AnimatedSprite from '../graphics/AnimatedSprite.js'
import BaseComponent from './BaseComponent.js'
import ComponentManager from './ComponentManager.js'
import IComponent from './IComponent.js'
import IComponentBuilder from './IComponentBuilder.js'
import IComponentData from './IComponentData.js'
import { SpriteComponentData } from './SpriteComponent.js'

export class AnimatedSpriteComponentData
  extends SpriteComponentData
  implements IComponentData
{
  frameWidth: number
  frameHeight: number
  frameCount: number
  frameSequence: number[] = []

  setFromJson(json: any): void {
    super.setFromJson(json)

    if (json.frameWidth === undefined) {
      throw new Error(
        'AnimatedSpriteComponentData requires "frameWidth" to be defined'
      )
    }
    this.frameWidth = Number(json.frameWidth)

    if (json.frameHeight === undefined) {
      throw new Error(
        'AnimatedSpriteComponentData requires "frameHeight" to be defined'
      )
    }
    this.frameHeight = Number(json.frameHeight)

    if (json.frameCount === undefined) {
      throw new Error(
        'AnimatedSpriteComponentData requires "frameCount" to be defined'
      )
    }
    this.frameCount = Number(json.frameCount)

    if (json.frameSequence === undefined) {
      throw new Error(
        'AnimatedSpriteComponentData requires "frameSequence" to be defined'
      )
    }
    this.frameSequence = json.frameSequence
  }
}

export class AnimatedSpriteComponentBuilder
  implements IComponentBuilder
{
  get type(): string {
    return 'animatedSprite'
  }

  buildFromJson(json: any): IComponent {
    const data = new AnimatedSpriteComponentData()
    data.setFromJson(json)
    return new AnimatedSpriteComponent(data)
  }
}

export default class AnimatedSpriteComponent extends BaseComponent {
  private _sprite: AnimatedSprite

  constructor(data: AnimatedSpriteComponentData) {
    super(data)

    this._sprite = new AnimatedSprite(
      data.name,
      data.materialName,
      data.frameWidth,
      data.frameHeight,
      data.frameWidth,
      data.frameHeight,
      data.frameCount,
      data.frameSequence
    )
  }

  load(): void {
    this._sprite.load()
  }

  update(time: number): void {
    this._sprite.update(time)

    super.update(time)
  }

  render(shader: Shader) {
    this._sprite.draw(shader, this.owner.worldMatrix)
    super.render(shader)
  }
}

ComponentManager.registerBuilder(new AnimatedSpriteComponentBuilder())
