import Vector3 from './Vector3'

export default class Matrix4x4 {
  private _data: number[] = []

  private constructor() {
    // prettier-ignore
    this._data = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  }

  get data(): number[] {
    return this._data
  }

  static identity(): Matrix4x4 {
    return new Matrix4x4()
  }

  static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    nearClip: number,
    farClip: number
  ): Matrix4x4 {
    const matrix = new Matrix4x4()

    const leftRight = 1 / (left - right)
    const bottomTop = 1 / (bottom - top)
    const nearFar = 1 / (nearClip - farClip)

    // First row
    matrix._data[0] = -2 * leftRight

    // Second row
    matrix._data[5] = -2 * bottomTop

    // Third row
    matrix._data[10] = 2 * nearFar

    // Forth row
    matrix._data[12] = (left + right) * leftRight
    matrix._data[13] = (top + bottom) * bottomTop
    matrix._data[14] = (farClip + nearClip) * nearFar

    return matrix
  }

  static translation(position: Vector3): Matrix4x4 {
    const matrix = new Matrix4x4()

    matrix._data[12] = position.x
    matrix._data[13] = position.y
    matrix._data[14] = position.z

    return matrix
  }
}
