import Vector2 from '../math/Vector2.js'
import Message from '../message/Message.js'

export enum Keys {
  LEFT = 37,
  A = 65,
  UP = 38,
  W = 87,
  RIGHT = 39,
  D = 68,
  DOWN = 40,
  S = 83,
}

export class MouseContext {
  leftDown: boolean
  rightDown: boolean
  position: Vector2

  constructor(
    leftDown: boolean,
    rightDown: boolean,
    position: Vector2
  ) {
    this.leftDown = leftDown
    this.rightDown = rightDown
    this.position = position
  }
}

export default class InputManager {
  private static _keys: boolean[] = []
  private static _previousMouseX: number
  private static _previousMouseY: number
  private static _mouseX: number
  private static _mouseY: number
  private static _leftDown: boolean = false
  private static _rightDown: boolean = false

  static initialize(): void {
    for (let i = 0; i < 255; i++) {
      InputManager._keys[i] = false
    }

    window.addEventListener('keydown', InputManager.onKeyDown)
    window.addEventListener('keyup', InputManager.onKeyUp)
    window.addEventListener('mousemove', InputManager.onMouseMove)
    window.addEventListener('mousedown', InputManager.onMouseDown)
    window.addEventListener('mouseup', InputManager.onMouseUp)
  }

  static isKeyDown(...keys: Keys[]): boolean {
    for (let i = 0; i < keys.length; i++) {
      if (InputManager._keys[keys[i]]) {
        return true
      }
    }
    return false
  }

  static getMousePosition(): Vector2 {
    return new Vector2(InputManager._mouseX, InputManager._mouseY)
  }

  private static onKeyDown(event: KeyboardEvent): boolean {
    console.log(event.keyCode)
    InputManager._keys[event.keyCode] = true
    event.preventDefault()
    event.stopPropagation()
    return false
  }

  private static onKeyUp(event: KeyboardEvent): boolean {
    InputManager._keys[event.keyCode] = false
    event.preventDefault()
    event.stopPropagation()
    return false
  }

  private static onMouseMove(event: MouseEvent): void {
    InputManager._previousMouseX = InputManager._mouseX
    InputManager._previousMouseY = InputManager._mouseY

    InputManager._mouseX = event.clientX
    InputManager._mouseY = event.clientY
  }

  private static onMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      InputManager._leftDown = true
    } else if (event.button === 2) {
      InputManager._rightDown = true
    }

    Message.send(
      'MOUSE_DOWN',
      this,
      new MouseContext(
        InputManager._leftDown,
        InputManager._rightDown,
        InputManager.getMousePosition()
      )
    )
  }

  private static onMouseUp(event: MouseEvent): void {
    if (event.button === 0) {
      InputManager._leftDown = false
    } else if (event.button === 2) {
      InputManager._rightDown = false
    }

    Message.send(
      'MOUSE_UP',
      this,
      new MouseContext(
        InputManager._leftDown,
        InputManager._rightDown,
        InputManager.getMousePosition()
      )
    )
  }
}
