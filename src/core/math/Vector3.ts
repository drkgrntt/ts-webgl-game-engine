export default class Vector3 {
  private _x: number
  private _y: number
  private _z: number

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this._x = x
    this._y = y
    this._z = z
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

  get z(): number {
    return this._z
  }

  set z(value: number) {
    this._z = value
  }

  static get zero(): Vector3 {
    return new Vector3()
  }

  static get one(): Vector3 {
    return new Vector3(1, 1, 1)
  }

  toArray(): number[] {
    return [this._x, this._y, this._z]
  }

  toFloat32Array(): Float32Array {
    return new Float32Array(this.toArray())
  }

  copyFrom(vector: Vector3): void {
    this._x = vector._x
    this._y = vector._y
    this._z = vector._z
  }

  setFromJson(json: any): void {
    if (json.x !== undefined) {
      this._x = Number(json.x)
    }

    if (json.y !== undefined) {
      this._y = Number(json.y)
    }

    if (json.z !== undefined) {
      this._z = Number(json.z)
    }
  }

  add(vector: Vector3): Vector3 {
    this._x += vector._x
    this._y += vector._y
    this._z += vector._z

    return this
  }

  subtract(vector: Vector3): Vector3 {
    this._x -= vector._x
    this._y -= vector._y
    this._z -= vector._z

    return this
  }

  multiply(vector: Vector3): Vector3 {
    this._x *= vector._x
    this._y *= vector._y
    this._z *= vector._z

    return this
  }

  divide(vector: Vector3): Vector3 {
    this._x /= vector._x
    this._y /= vector._y
    this._z /= vector._z

    return this
  }
}
