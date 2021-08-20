import AssetManager from './AssetManager.js'
import IAsset from './IAsset.js'
import IAssetLoader from './IAssetLoader.js'

export class JsonAsset implements IAsset {
  readonly name: string
  readonly data: any

  constructor(name: string, data: any) {
    this.name = name
    this.data = data
  }
}

export default class JsonAssetLoader implements IAssetLoader {
  get supportedExtensions(): string[] {
    return ['json']
  }

  loadAsset(assetName: string): void {
    fetch(assetName)
      .then((res) => res.json())
      .then((res) => this.onJsonLoaded(assetName, res))
  }

  private onJsonLoaded(assetName: string, data: any) {
    const asset = new JsonAsset(assetName, data)
    console.log(asset)
    AssetManager.onAssetLoaded(asset)
  }
}
