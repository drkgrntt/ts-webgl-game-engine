export let gl: WebGLRenderingContext

export default class GLUtilities {
  static initialize(elementId?: string): HTMLCanvasElement {
    let canvas: HTMLCanvasElement

    if (elementId) {
      canvas = document.getElementById(elementId) as HTMLCanvasElement
      if (!canvas) {
        throw new Error(
          `Could not initialize canvas with id ${elementId}`
        )
      }
    } else {
      canvas = document.createElement('canvas')
      document.body.appendChild(canvas)
    }

    const context = canvas.getContext('webgl')
    if (!context) {
      throw new Error('Browser not supported')
    }

    gl = context

    return canvas
  }
}
