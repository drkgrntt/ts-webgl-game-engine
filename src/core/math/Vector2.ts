export default class Vector2 {
  private _x: number
  private _y: number

  constructor(x: number = 0, y: number = 0) {
    this._x = x
    this._y = y
  }

  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
  }

  toArray(): number[] {
    return [this._x, this._y]
  }

  toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray())
  }

  setFromJson(json: any): void {
    if (json.x !== undefined) {
      this._x = Number(json.x)
    }

    if (json.y !== undefined) {
      this._y = Number(json.y)
    }
  }
}
