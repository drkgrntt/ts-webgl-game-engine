import { MESSAGE_ASSET_LOADER_ASSET_LOADED } from '../assets/AssetManager.js'
import { ImageAsset } from '../assets/ImageAssetLoader.js'
import Vector2 from '../math/Vector2.js'
import IMessageHandler from '../message/IMessageHandler.js'
import Message from '../message/Message.js'
import Sprite from './Sprite.js'

class UVInfo {
  min: Vector2
  max: Vector2

  constructor(min: Vector2, max: Vector2) {
    this.min = min
    this.max = max
  }
}

export default class AnimatedSprite
  extends Sprite
  implements IMessageHandler
{
  private _frameWidth: number
  private _frameHeight: number
  private _frameCount: number
  private _frameSequence: number[]

  // TODO make this configurable
  private _frameTime: number = 111

  private _frameUVs: UVInfo[] = []
  private _currentFrame: number = 0
  private _currentTime: number = 0
  private _assetLoaded: boolean = false
  private _assetWidth: number = 2
  private _assetHeight: number = 2

  constructor(
    name: string,
    materialName: string,
    width: number = 100,
    height: number = 100,
    frameWidth: number = 10,
    frameHeight: number = 10,
    frameCount: number = 1,
    frameSequence: number[] = []
  ) {
    super(name, materialName, width, height)
    this._frameWidth = frameWidth
    this._frameHeight = frameHeight
    this._frameCount = frameCount
    this._frameSequence = frameSequence

    Message.subscribe(
      MESSAGE_ASSET_LOADER_ASSET_LOADED +
        this._material.diffuseTextureName,
      this
    )
  }

  destroy(): void {
    super.destroy()
  }

  /**
   * The message handler for this component
   * @param message The message to be handled
   */
  onMessage(message: Message): void {
    if (
      message.code ===
      MESSAGE_ASSET_LOADER_ASSET_LOADED +
        this._material.diffuseTextureName
    ) {
      const asset = message.context as ImageAsset
      this._assetHeight = asset.height
      this._assetWidth = asset.width
      this._assetLoaded = true
      this.calculateUVs()
    }
  }

  load(): void {
    super.load()
  }

  update(time: number): void {
    if (!this._assetLoaded) {
      return
    }

    this._currentTime += time

    if (this._currentTime > this._frameTime) {
      this._currentTime = 0

      this._currentFrame++
      if (this._currentFrame >= this._frameSequence.length) {
        this._currentFrame = 0
      }

      const frameUVs = this._frameSequence[this._currentFrame]
      this._vertices[0].texCoords.copyFrom(
        this._frameUVs[frameUVs].min
      )
      this._vertices[1].texCoords = new Vector2(
        this._frameUVs[frameUVs].min.x,
        this._frameUVs[frameUVs].max.y
      )
      this._vertices[2].texCoords.copyFrom(
        this._frameUVs[frameUVs].max
      )
      this._vertices[3].texCoords.copyFrom(
        this._frameUVs[frameUVs].max
      )
      this._vertices[4].texCoords = new Vector2(
        this._frameUVs[frameUVs].max.x,
        this._frameUVs[frameUVs].min.y
      )
      this._vertices[5].texCoords.copyFrom(
        this._frameUVs[frameUVs].min
      )

      this._buffer.clearData()
      for (let vertex of this._vertices) {
        this._buffer.pushBackData(vertex.toArray())
      }

      this._buffer.upload()
      this._buffer.unbind()
    }

    super.update(time)
  }

  private calculateUVs(): void {
    let totalWidth: number = 0
    let yValue: number = 0

    for (let i = 0; i < this._frameCount; i++) {
      totalWidth += i * this._frameWidth
      if (totalWidth > this._assetWidth) {
        yValue++
        totalWidth = 0
      }

      const uMin = (i * this._frameWidth) / this._assetWidth
      const vMin = (yValue * this._frameHeight) / this._assetHeight
      const min: Vector2 = new Vector2(uMin, vMin)

      const uMax =
        (i * this._frameWidth + this._frameWidth) / this._assetWidth
      const vMax =
        (yValue * this._frameHeight + this._frameHeight) /
        this._assetHeight
      const max: Vector2 = new Vector2(uMax, vMax)

      this._frameUVs.push(new UVInfo(min, max))
    }
  }
}
