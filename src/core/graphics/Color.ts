export default class Color {
  private _red: number
  private _green: number
  private _blue: number
  private _alpha: number

  constructor(
    red: number = 255,
    green: number = 255,
    blue: number = 255,
    alpha: number = 255
  ) {
    this._red = red
    this._green = green
    this._blue = blue
    this._alpha = alpha
  }

  get red(): number {
    return this._red
  }

  get redFloat(): number {
    return this._red / 255.0
  }

  set red(value: number) {
    this._red = value
  }

  get green(): number {
    return this._green
  }

  get greenFloat(): number {
    return this._green / 255.0
  }

  set green(value: number) {
    this._green = value
  }

  get blue(): number {
    return this._blue
  }

  get blueFloat(): number {
    return this._blue / 255.0
  }

  set blue(value: number) {
    this._blue = value
  }

  get alpha(): number {
    return this._alpha
  }

  get alphaFloat(): number {
    return this._alpha / 255.0
  }

  set alpha(value: number) {
    this._alpha = value
  }

  toArray(): number[] {
    return [this._red, this._green, this._blue, this._alpha]
  }

  toFloatArray(): number[] {
    return [
      this._red / 255.0,
      this._green / 255.0,
      this._blue / 255.0,
      this._alpha / 255.0,
    ]
  }

  toFloat32Array(): Float32Array {
    return new Float32Array(this.toFloatArray())
  }

  static white(): Color {
    return new Color(255, 255, 255, 255)
  }

  static black(): Color {
    return new Color(0, 0, 0, 255)
  }

  static red(): Color {
    return new Color(255, 0, 0, 255)
  }

  static green(): Color {
    return new Color(0, 255, 0, 255)
  }

  static blue(): Color {
    return new Color(0, 0, 255, 255)
  }
}
