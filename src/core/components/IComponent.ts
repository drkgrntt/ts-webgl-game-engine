import Shader from '../gl/Shader'
import SimObject from '../world/SimObject'

export default interface IComponent {
  name: string
  readonly owner: SimObject

  setOwner(owner: SimObject): void
  load(): void
  unload(): void
  update(time: number): void
  render(shader: Shader): void
}
