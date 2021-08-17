export default interface IAssetLoader {
  readonly supportedExtensions: string[]

  loadAsset(assetName: string): void
}
