import AssetManager from './core/assets/AssetManager.js'
import GLUtilities, { gl } from './core/gl/GLUtilities.js'
import BasicShader from './core/gl/shaders/BasicShader.js'
import Color from './core/graphics/Color.js'
import Material from './core/graphics/Material.js'
import MaterialManager from './core/graphics/MaterialManager.js'
import Matrix4x4 from './core/math/Matrix4x4.js'
import Transporter from './core/message/Transporter.js'
import ZoneManager from './core/world/ZoneManager.js'
import './core/components/SpriteComponent.js'
import './core/behaviors/RotationBehavior.js'

export default class Engine {
  private _canvas: HTMLCanvasElement
  private _basicShader: BasicShader
  private _projection: Matrix4x4

  constructor() {}

  start(): void {
    this._canvas = GLUtilities.initialize()
    AssetManager.initialize()
    ZoneManager.initialize()

    gl.clearColor(0.0, 0.0, 0.0, 1)

    this._basicShader = new BasicShader()
    this._basicShader.use()

    // Load materials
    MaterialManager.registerMaterial(
      new Material(
        'crate',
        'assets/textures/crate.jpg',
        new Color(0, 128, 255, 255)
      )
    )

    // Load
    this._projection = Matrix4x4.orthographic(
      0,
      this._canvas.width,
      this._canvas.height,
      0,
      -100,
      100
    )

    // TODO change this to be read from a config later
    ZoneManager.changeZone(0)

    this.resize()
    this.loop()
  }

  loop(): void {
    Transporter.update(0)

    ZoneManager.update(0)

    gl.clear(gl.COLOR_BUFFER_BIT)

    ZoneManager.render(this._basicShader)

    // Set uniforms
    const projectionPosition =
      this._basicShader.getUniformLocation('u_projection')
    gl.uniformMatrix4fv(
      projectionPosition,
      false,
      new Float32Array(this._projection.data)
    )

    requestAnimationFrame(this.loop.bind(this))
  }

  resize(): void {
    if (!this._canvas) return

    this._canvas.width = window.innerWidth
    this._canvas.height = window.innerHeight

    gl.viewport(-1, 1, gl.canvas.width, gl.canvas.height)
    this._projection = Matrix4x4.orthographic(
      0,
      this._canvas.width,
      this._canvas.height,
      0,
      -100,
      100
    )
  }
}
