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

    // TODO add x and y for 3d
    const rotation = Matrix4x4.rotationZ(this.rotation.z)
    const scale = Matrix4x4.scale(this.scale)

    // T * R * S
    return Matrix4x4.multiply(
      Matrix4x4.multiply(translation, rotation),
      scale
    )
  }
}
