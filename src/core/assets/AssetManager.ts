import Message from '../message/Message.js'
import IAsset from './IAsset.js'
import IAssetLoader from './IAssetLoader.js'
import ImageAssetLoader from './ImageAssetLoader.js'
import JsonAssetLoader from './JsonAssetLoader.js'

export const MESSAGE_ASSET_LOADER_ASSET_LOADED =
  'MESSAGE_ASSET_LOADER_ASSET_LOADED::'

export default class AssetManager {
  private static _loaders: IAssetLoader[] = []
  private static _loadedAssets: Record<string, IAsset> = {}

  private constructor() {}

  static initialize(): void {
    AssetManager._loaders.push(new ImageAssetLoader())
    AssetManager._loaders.push(new JsonAssetLoader())
  }

  static registerLoader(loader: IAssetLoader): void {
    AssetManager._loaders.push(loader)
  }

  static onAssetLoaded(asset: IAsset): void {
    AssetManager._loadedAssets[asset.name] = asset
    Message.send(
      MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name,
      this,
      asset
    )
  }

  public static loadAsset(assetName: string): void {
    const extension = assetName.split('.').pop()?.toLowerCase()
    if (!extension) {
      throw new Error(`Invalid asset name: ${assetName}`)
    }

    for (let loader of AssetManager._loaders) {
      if (loader.supportedExtensions.includes(extension)) {
        loader.loadAsset(assetName)
        return
      }
    }

    console.warn(
      `Unable to load asset with extension ${extension} because there is no loader associated with it`
    )
  }

  public static isAssetLoaded(assetName: string): boolean {
    return !!AssetManager._loadedAssets[assetName]
  }

  public static getAsset(assetName: string): IAsset | void {
    const asset = AssetManager._loadedAssets[assetName]

    if (asset) {
      return asset
    }

    AssetManager.loadAsset(assetName)
  }
}
