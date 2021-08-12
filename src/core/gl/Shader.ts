import { gl } from './GLUtilities.js'

export default class Shader {
  private _name: string
  private _program: WebGLProgram
  private _attributes: Record<string, number> = {}
  private _uniforms: Record<string, WebGLUniformLocation> = {}

  constructor(
    name: string,
    vertexSource: string,
    fragmentSource: string
  ) {
    this._name = name

    const vertexShader = this.loadShader(
      vertexSource,
      gl.VERTEX_SHADER
    )
    const fragmentShader = this.loadShader(
      fragmentSource,
      gl.FRAGMENT_SHADER
    )

    this.createProgram(vertexShader, fragmentShader)

    this.detectAttributes()
    this.detectUniforms()
  }

  get name(): string {
    return this._name
  }

  use(): void {
    gl.useProgram(this._program)
  }

  getAttributeLocation(name: string): number {
    if (typeof this._attributes[name] === 'undefined') {
      throw new Error(
        `Attribute ${name} not found in shader named ${this._name}`
      )
    }

    return this._attributes[name]
  }

  getUniformLocation(name: string): WebGLUniformLocation {
    if (typeof this._uniforms[name] === 'undefined') {
      throw new Error(
        `Uniform ${name} not found in shader named ${this._name}`
      )
    }

    return this._uniforms[name]
  }

  destroy(): void {}

  private loadShader(source: string, type: number): WebGLShader {
    const shader = gl.createShader(type)
    if (!shader) {
      throw new Error(`unable to load shader ${this._name}`)
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const error = gl.getShaderInfoLog(shader)
    if (error) {
      throw new Error(
        `Error compiling shader ${this._name}: ${error}`
      )
    }

    return shader
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): void {
    const program = gl.createProgram()
    if (!program) {
      throw new Error(`Error creating program ${this._name}`)
    }
    this._program = program

    gl.attachShader(this._program, vertexShader)
    gl.attachShader(this._program, fragmentShader)

    gl.linkProgram(this._program)
  }

  private detectAttributes(): void {
    const attributeCount: number = gl.getProgramParameter(
      this._program,
      gl.ACTIVE_ATTRIBUTES
    )

    for (let i = 0; i < attributeCount; i++) {
      const attributeInfo = gl.getActiveAttrib(this._program, i)
      if (!attributeInfo) {
        break
      }

      this._attributes[attributeInfo.name] = gl.getAttribLocation(
        this._program,
        attributeInfo.name
      )
    }
  }

  private detectUniforms(): void {
    const uniformCount: number = gl.getProgramParameter(
      this._program,
      gl.ACTIVE_UNIFORMS
    )

    for (let i = 0; i < uniformCount; i++) {
      const uniformInfo = gl.getActiveUniform(this._program, i)
      if (!uniformInfo) {
        break
      }

      const uniformLocation = gl.getUniformLocation(
        this._program,
        uniformInfo.name
      )
      if (!uniformLocation) {
        break
      }
      this._uniforms[uniformInfo.name] = uniformLocation
    }
  }
}
