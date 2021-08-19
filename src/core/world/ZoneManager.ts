import Shader from '../gl/Shader.js'
import TestZone from './TestZone.js'
import Zone from './Zone.js'

export default class ZoneManager {
  private static _globalZoneId: number = -1
  private static _zones: Record<number, Zone> = {}
  private static _activeZone: Zone

  private constructor() {}

  static createZone(name: string, description: string): number {
    ZoneManager._globalZoneId++

    const zone = new Zone(
      ZoneManager._globalZoneId,
      name,
      description
    )
    ZoneManager._zones[ZoneManager._globalZoneId] = zone

    return ZoneManager._globalZoneId
  }

  // TODO: This is temporary code until file loading is supported
  static createTestZone(): number {
    ZoneManager._globalZoneId++

    const zone = new TestZone(
      ZoneManager._globalZoneId,
      'test',
      'A simple test zone'
    )
    ZoneManager._zones[ZoneManager._globalZoneId] = zone

    return ZoneManager._globalZoneId
  }

  static changeZone(id: number): void {
    if (ZoneManager._activeZone) {
      ZoneManager._activeZone.onDeactivated()
      ZoneManager._activeZone.unload()
    }

    if (ZoneManager._zones[id]) {
      ZoneManager._activeZone = ZoneManager._zones[id]
      ZoneManager._activeZone.onActivated()
      ZoneManager._activeZone.load()
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
}
