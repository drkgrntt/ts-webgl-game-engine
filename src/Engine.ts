import AssetManager from './core/assets/AssetManager.js'
import GLUtilities, { gl } from './core/gl/GLUtilities.js'
import BasicShader from './core/gl/shaders/BasicShader.js'
import Color from './core/graphics/Color.js'
import Material from './core/graphics/Material.js'
import MaterialManager from './core/graphics/MaterialManager.js'
import Matrix4x4 from './core/math/Matrix4x4.js'
import InputManager, {
  MouseContext,
} from './core/input/InputManager.js'
import Transporter from './core/message/Transporter.js'
import ZoneManager from './core/world/ZoneManager.js'
import './core/components/SpriteComponent.js'
import './core/components/AnimatedSpriteComponent.js'
import './core/behaviors/RotationBehavior.js'
import './core/behaviors/KeyboardMovementBehavior.js'
import IMessageHandler from './core/message/IMessageHandler.js'
import Message from './core/message/Message.js'
import AudioManager from './core/audio/AudioManager.js'

export default class Engine implements IMessageHandler {
  private _canvas: HTMLCanvasElement
  private _basicShader: BasicShader
  private _projection: Matrix4x4
  private _previousTime: number = 0

  start(): void {
    this._canvas = GLUtilities.initialize()
    AssetManager.initialize()
    InputManager.initialize()
    ZoneManager.initialize()

    Message.subscribe('MOUSE_UP', this)

    gl.clearColor(0.0, 1.0, 0.5, 1)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    this._basicShader = new BasicShader()
    this._basicShader.use()

    // Load materials
    MaterialManager.registerMaterial(
      new Material(
        'crate',
        'assets/textures/crate.jpg',
        Color.white()
      )
    )
    MaterialManager.registerMaterial(
      new Material('bird', 'assets/textures/bird.png', Color.white())
    )

    AudioManager.loadSoundFile(
      'flap',
      'assets/sounds/flap.mp3',
      false
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

  onMessage(message: Message): void {
    if (message.code === 'MOUSE_UP') {
      const context = message.context as MouseContext
      document.title = `Position: [${context.position.x}, ${context.position.y}]`

      AudioManager.playSound('flap')
    }
  }

  loop(): void {
    this.update()
    this.render()

    requestAnimationFrame(this.loop.bind(this))
  }

  private update(): void {
    const delta = performance.now() - this._previousTime

    Transporter.update(delta)

    ZoneManager.update(delta)

    this._previousTime = performance.now()
  }

  private render(): void {
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
  }
}
