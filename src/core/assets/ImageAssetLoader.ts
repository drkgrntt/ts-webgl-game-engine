import AssetManager from './AssetManager.js'
import IAsset from './IAsset.js'
import IAssetLoader from './IAssetLoader.js'

export class ImageAsset implements IAsset {
  readonly name: string
  readonly data: HTMLImageElement

  constructor(name: string, data: HTMLImageElement) {
    this.name = name
    this.data = data
  }

  get width(): number {
    return this.data.width
  }

  get height(): number {
    return this.data.height
  }
}

export default class ImageAssetLoader implements IAssetLoader {
  get supportedExtensions(): string[] {
    return ['png', 'gif', 'jpg']
  }

  loadAsset(assetName: string): void {
    const image: HTMLImageElement = new Image()
    image.onload = this.onImageLoaded.bind(this, assetName, image)
    image.src = assetName
  }

  private onImageLoaded(
    assetName: string,
    image: HTMLImageElement
  ): void {
    console.log(
      `onImageLoaded: assetName/image ${assetName}/${image}`
    )
    const asset = new ImageAsset(assetName, image)
    AssetManager.onAssetLoaded(asset)
  }
}
