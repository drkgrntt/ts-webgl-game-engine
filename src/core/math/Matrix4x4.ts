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

  static rotationX(angleInRadians: number): Matrix4x4 {
    let maxrix = new Matrix4x4()

    let cos = Math.cos(angleInRadians)
    let sin = Math.sin(angleInRadians)

    maxrix._data[5] = cos
    maxrix._data[6] = sin
    maxrix._data[9] = -sin
    maxrix._data[10] = cos

    return maxrix
  }

  static rotationY(angleInRadians: number): Matrix4x4 {
    let matrix = new Matrix4x4()

    let cos = Math.cos(angleInRadians)
    let sin = Math.sin(angleInRadians)

    matrix._data[0] = cos
    matrix._data[2] = -sin
    matrix._data[8] = sin
    matrix._data[10] = cos

    return matrix
  }

  static rotationZ(angleInRadians: number): Matrix4x4 {
    const matrix = new Matrix4x4()

    const cos = Math.cos(angleInRadians)
    const sin = Math.sin(angleInRadians)

    matrix._data[0] = cos
    matrix._data[1] = sin
    matrix._data[4] = -sin
    matrix._data[5] = cos

    return matrix
  }

  static rotationXYZ(
    xRadians: number,
    yRadians: number,
    zRadians: number
  ): Matrix4x4 {
    const rx = Matrix4x4.rotationX(xRadians)
    const ry = Matrix4x4.rotationY(yRadians)
    const rz = Matrix4x4.rotationZ(zRadians)

    return Matrix4x4.multiply(Matrix4x4.multiply(rz, ry), rx)
  }

  static scale(scale: Vector3): Matrix4x4 {
    const matrix = new Matrix4x4()

    matrix._data[0] = scale.x
    matrix._data[5] = scale.y
    matrix._data[10] = scale.z

    return matrix
  }

  static multiply(a: Matrix4x4, b: Matrix4x4): Matrix4x4 {
    const matrix = new Matrix4x4()

    const b00 = b._data[0 * 4 + 0]
    const b01 = b._data[0 * 4 + 1]
    const b02 = b._data[0 * 4 + 2]
    const b03 = b._data[0 * 4 + 3]
    const b10 = b._data[1 * 4 + 0]
    const b11 = b._data[1 * 4 + 1]
    const b12 = b._data[1 * 4 + 2]
    const b13 = b._data[1 * 4 + 3]
    const b20 = b._data[2 * 4 + 0]
    const b21 = b._data[2 * 4 + 1]
    const b22 = b._data[2 * 4 + 2]
    const b23 = b._data[2 * 4 + 3]
    const b30 = b._data[3 * 4 + 0]
    const b31 = b._data[3 * 4 + 1]
    const b32 = b._data[3 * 4 + 2]
    const b33 = b._data[3 * 4 + 3]
    const a00 = a._data[0 * 4 + 0]
    const a01 = a._data[0 * 4 + 1]
    const a02 = a._data[0 * 4 + 2]
    const a03 = a._data[0 * 4 + 3]
    const a10 = a._data[1 * 4 + 0]
    const a11 = a._data[1 * 4 + 1]
    const a12 = a._data[1 * 4 + 2]
    const a13 = a._data[1 * 4 + 3]
    const a20 = a._data[2 * 4 + 0]
    const a21 = a._data[2 * 4 + 1]
    const a22 = a._data[2 * 4 + 2]
    const a23 = a._data[2 * 4 + 3]
    const a30 = a._data[3 * 4 + 0]
    const a31 = a._data[3 * 4 + 1]
    const a32 = a._data[3 * 4 + 2]
    const a33 = a._data[3 * 4 + 3]

    matrix._data[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30
    matrix._data[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31
    matrix._data[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32
    matrix._data[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33
    matrix._data[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30
    matrix._data[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31
    matrix._data[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32
    matrix._data[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33
    matrix._data[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30
    matrix._data[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31
    matrix._data[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32
    matrix._data[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33
    matrix._data[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30
    matrix._data[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31
    matrix._data[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32
    matrix._data[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33

    return matrix
  }

  toFloat32Array(): Float32Array {
    return new Float32Array(this._data)
  }

  copyFrom(matrix: Matrix4x4): void {
    for (let i = 0; i < 16; i++) {
      this._data[i] = matrix._data[i]
    }
  }
}
