import { gl } from './GLUtilities.js'

/**
 * The info needed for a GLBuffer attribute
 */
export class AttributeInfo {
  /**
   * The location of the attribute
   */
  location: number

  /**
   * The size (number of elements) in this attribute (i.e. Vector3 = 3)
   */
  size: number

  /**
   * The number of elements fromt he beginning of the buffer
   */
  offset: number
}

/**
 * A WebGL Buffer
 */
export default class GLBuffer {
  private _hasAttributeLocation: boolean = false
  private _elementSize: number
  private _stride: number
  private _buffer: WebGLBuffer

  private _targetBufferType: number
  private _dataType: number
  private _mode: number
  private _typeSize: number

  private _data: number[] = []
  private _attributes: AttributeInfo[] = []

  constructor(
    elementSize: number,
    dataType: number = gl.FLOAT,
    targetBufferType: number = gl.ARRAY_BUFFER,
    mode: number = gl.TRIANGLES
  ) {
    this._elementSize = elementSize
    this._dataType = dataType
    this._targetBufferType = targetBufferType
    this._mode = mode

    // Determine byte size
    switch (this._dataType) {
      case gl.FLOAT:
      case gl.INT:
      case gl.UNSIGNED_INT:
        this._typeSize = 4
        break

      case gl.SHORT:
      case gl.UNSIGNED_SHORT:
        this._typeSize = 2
        break

      case gl.BYTE:
      case gl.UNSIGNED_BYTE:
        this._typeSize = 1
        break

      default:
        throw new Error(
          `Unrecognized data type ${this._dataType.toString()}`
        )
    }

    this._stride = this._elementSize * this._typeSize
    const buffer = gl.createBuffer()
    if (!buffer) {
      throw new Error('Could not create buffer')
    }
    this._buffer = buffer
  }

  /**
   * Destroys this buffer
   */
  destroy(): void {
    gl.deleteBuffer(this._buffer)
  }

  /**
   * Binds this buffer
   * @param normalized Indicates if the data should be normalized
   */
  bind(normalized: boolean = false): void {
    gl.bindBuffer(this._targetBufferType, this._buffer)

    if (this._hasAttributeLocation) {
      for (let attribute of this._attributes) {
        gl.vertexAttribPointer(
          attribute.location,
          attribute.size,
          this._dataType,
          normalized,
          this._stride,
          attribute.offset * this._typeSize
        )

        gl.enableVertexAttribArray(attribute.location)
      }
    }
  }

  /**
   * Unbinds this buffer
   */
  unbind(): void {
    for (let attribute of this._attributes) {
      gl.disableVertexAttribArray(attribute.location)
    }

    gl.bindBuffer(this._targetBufferType, null)
  }

  /**
   * Adds an attribute with the provided information to this buffer
   * @param info The information to be added
   */
  addAttributeLocation(info: AttributeInfo): void {
    this._hasAttributeLocation = true
    this._attributes.push(info)
  }

  /**
   * Adds data to this buffer
   * @param data
   */
  pushBackData(data: number[]): void {
    for (let d of data) {
      this._data.push(d)
    }
  }

  /**
   * Uploads this buffer's data to the GPU
   */
  upload(): void {
    gl.bindBuffer(this._targetBufferType, this._buffer)

    let bufferData: ArrayBuffer

    switch (this._dataType) {
      case gl.FLOAT:
        bufferData = new Float32Array(this._data)
        break

      case gl.INT:
        bufferData = new Int32Array(this._data)
        break

      case gl.UNSIGNED_INT:
        bufferData = new Uint32Array(this._data)
        break

      case gl.SHORT:
        bufferData = new Int16Array(this._data)
        break

      case gl.UNSIGNED_SHORT:
        bufferData = new Uint16Array(this._data)
        break

      case gl.BYTE:
        bufferData = new Int8Array(this._data)
        break

      case gl.UNSIGNED_BYTE:
        bufferData = new Uint8Array(this._data)
        break

      default:
        throw new Error(
          `Unrecognized data type ${this._dataType.toString()}`
        )
    }

    gl.bufferData(this._targetBufferType, bufferData, gl.STATIC_DRAW)
  }

  /**
   * Draws this buffer
   */
  draw(): void {
    if (this._targetBufferType === gl.ARRAY_BUFFER) {
      gl.drawArrays(
        this._mode,
        0,
        this._data.length / this._elementSize
      )
    } else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
      gl.drawElements(
        this._mode,
        this._data.length,
        this._dataType,
        0
      )
    }
  }
}
