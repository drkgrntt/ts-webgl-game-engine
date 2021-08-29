export class SoundEffect {
  private _player: HTMLAudioElement

  assetPath: string

  constructor(assetPath: string, loop: boolean) {
    this._player = new Audio(assetPath)
    this._player.loop = loop
  }

  get loop(): boolean {
    return this._player.loop
  }

  set loop(value: boolean) {
    this._player.loop = value
  }

  destroy(): void {
    // @ts-ignore
    this._player = undefined
  }

  play(): void {
    if (!this._player.paused) {
      this.stop()
    }
    this._player.play()
  }

  pause(): void {
    this._player.pause()
  }

  stop(): void {
    this._player.pause()
    this._player.currentTime = 0
  }
}

export default class AudioManager {
  private static _soundEffects: Record<string, SoundEffect> = {}

  static loadSoundFile(
    name: string,
    assetPath: string,
    loop: boolean
  ): void {
    AudioManager._soundEffects[name] = new SoundEffect(
      assetPath,
      loop
    )
  }

  static playSound(name: string): void {
    if (AudioManager._soundEffects[name]) {
      AudioManager._soundEffects[name].play()
    }
  }

  static pauseSound(name: string): void {
    if (AudioManager._soundEffects[name]) {
      AudioManager._soundEffects[name].pause()
    }
  }

  static pauseAll(): void {
    for (let sfx in AudioManager._soundEffects) {
      AudioManager._soundEffects[sfx].pause()
    }
  }

  static stopSound(name: string): void {
    if (AudioManager._soundEffects[name]) {
      AudioManager._soundEffects[name].stop()
    }
  }

  static stopAll(): void {
    for (let sfx in AudioManager._soundEffects) {
      AudioManager._soundEffects[sfx].stop()
    }
  }
}
