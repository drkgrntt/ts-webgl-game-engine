import GLUtilities, { gl } from './core/gl/GLUtilities.js'
import Shader from './core/gl/Shader.js'
import Sprite from './core/graphics/sprite.js'
import Matrix4x4 from './core/math/Matrix4x4.js'

export default class Engine {
  private _canvas: HTMLCanvasElement
  private _shader: Shader
  private _projection: Matrix4x4

  private _sprite: Sprite

  constructor() {}

  start(): void {
    this._canvas = GLUtilities.initialize()
    this.resize()

    gl.clearColor(0.0, 0.0, 0.0, 1)

    this.loadShaders()
    this._shader.use()

    // Load
    this._projection = Matrix4x4.orthographic(
      0,
      this._canvas.width,
      0,
      this._canvas.height,
      -100,
      100
    )

    this._sprite = new Sprite('test')
    this._sprite.load()

    this._sprite.position.y = 200
    this._sprite.position.x = 100

    this.loop()
  }

  loop(): void {
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Set uniforms
    const colorPosition = this._shader.getUniformLocation('u_color')
    gl.uniform4f(colorPosition, 0, 1, 0.5, 1)

    const projectionPosition =
      this._shader.getUniformLocation('u_projection')
    gl.uniformMatrix4fv(
      projectionPosition,
      false,
      new Float32Array(this._projection.data)
    )

    const modelLocation = this._shader.getUniformLocation('u_model')
    gl.uniformMatrix4fv(
      modelLocation,
      false,
      new Float32Array(
        Matrix4x4.translation(this._sprite.position).data
      )
    )

    this._sprite.draw()

    requestAnimationFrame(this.loop.bind(this))
  }

  resize(): void {
    if (!this._canvas) return

    this._canvas.width = window.innerWidth
    this._canvas.height = window.innerHeight

    gl.viewport(-1, 1, -1, 1)
  }

  private loadShaders(): void {
    const vertexShaderSource = `
attribute vec3 a_position;

uniform mat4 u_projection;
uniform mat4 u_model;

void main() {
  gl_Position = u_projection * u_model * vec4(a_position, 1.0);
}
    `

    const fragmentShaderSource = `
precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}
    `

    this._shader = new Shader(
      'basic',
      vertexShaderSource,
      fragmentShaderSource
    )
  }
}
