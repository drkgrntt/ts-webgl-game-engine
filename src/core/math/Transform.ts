import Matrix4x4 from './Matrix4x4.js'
import Vector3 from './Vector3.js'

export default class Transform {
  position: Vector3 = Vector3.zero
  rotation: Vector3 = Vector3.zero
  scale: Vector3 = Vector3.one

  copyFrom(transform: Transform): void {
    this.position.copyFrom(transform.position)
    this.rotation.copyFrom(transform.rotation)
    this.scale.copyFrom(transform.scale)
  }

  getTransformationMatrix(): Matrix4x4 {
    const translation = Matrix4x4.translation(this.position)

    const rotation = Matrix4x4.rotationXYZ(
      this.rotation.x,
      this.rotation.y,
      this.rotation.z
    )
    const scale = Matrix4x4.scale(this.scale)

    // T * R * S
    return Matrix4x4.multiply(
      Matrix4x4.multiply(translation, rotation),
      scale
    )
  }

  setFromJson(json: any): void {
    if (json.position !== undefined) {
      this.position.setFromJson(json.position)
    }

    if (json.rotation !== undefined) {
      this.rotation.setFromJson(json.rotation)
    }

    if (json.scale !== undefined) {
      this.scale.setFromJson(json.scale)
    }
  }
}
