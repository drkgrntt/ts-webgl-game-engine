import AssetManager, {
  MESSAGE_ASSET_LOADER_ASSET_LOADED,
} from '../assets/AssetManager.js'
import IAsset from '../assets/IAsset.js'
import { JsonAsset } from '../assets/JsonAssetLoader.js'
import Shader from '../gl/Shader.js'
import IMessageHandler from '../message/IMessageHandler.js'
import Message from '../message/Message.js'
import Zone from './Zone.js'

export default class ZoneManager implements IMessageHandler {
  private static _globalZoneId: number = -1
  // private static _zones: Record<number, Zone> = {}
  private static _registerdZones: Record<number, string> = {}
  private static _activeZone: Zone
  private static _instance: ZoneManager

  private constructor() {}

  static initialize(): void {
    ZoneManager._instance = new ZoneManager()

    // Temporary
    ZoneManager._registerdZones[0] = 'assets/zones/testZone.json'
  }

  static changeZone(id: number): void {
    if (ZoneManager._activeZone) {
      ZoneManager._activeZone.onDeactivated()
      ZoneManager._activeZone.unload()

      // @ts-ignore
      ZoneManager._activeZone = undefined
    }

    if (!ZoneManager._registerdZones[id]) {
      throw new Error(`Zone id: ${id.toString()} does not exist.`)
    }

    if (AssetManager.isAssetLoaded(ZoneManager._registerdZones[id])) {
      const asset = AssetManager.getAsset(
        ZoneManager._registerdZones[id]
      )
      ZoneManager.loadZone(asset as IAsset)
    } else {
      Message.subscribe(
        MESSAGE_ASSET_LOADER_ASSET_LOADED +
          ZoneManager._registerdZones[id],
        ZoneManager._instance
      )
      AssetManager.loadAsset(ZoneManager._registerdZones[id])
    }
  }

  static update(time: number): void {
    if (ZoneManager._activeZone) {
      ZoneManager._activeZone.update(time)
    }
  }

  static render(shader: Shader): void {
    if (ZoneManager._activeZone) {
      ZoneManager._activeZone.render(shader)
    }
  }

  onMessage(message: Message): void {
    if (message.code.includes(MESSAGE_ASSET_LOADER_ASSET_LOADED)) {
      const asset = message.context as JsonAsset
      ZoneManager.loadZone(asset)
    }
  }

  private static loadZone(asset: JsonAsset): void {
    const zoneData = asset.data

    let zoneId: number
    if (zoneData.id === undefined) {
      throw new Error(
        `Zone file format exception: Zone id not present`
      )
    }
    zoneId = Number(zoneData.id)

    let zoneName: string
    if (zoneData.id === undefined) {
      throw new Error(
        `Zone file format exception: Zone name not present`
      )
    }
    zoneName = String(zoneData.name)

    let zoneDescription: string | undefined
    if (zoneData.id !== undefined) {
      zoneDescription = String(zoneData.description)
    }

    ZoneManager._activeZone = new Zone(
      zoneId,
      zoneName,
      zoneDescription
    )
    ZoneManager._activeZone.initialize(zoneData)
    ZoneManager._activeZone.onActivated()
    ZoneManager._activeZone.load()
  }
}
