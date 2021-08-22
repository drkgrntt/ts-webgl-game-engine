import SimObject from '../world/SimObject.js'

export default interface IBehavior {
  name: string

  setOwner(owner: SimObject): void

  update(time: number): void

  apply(userData: any): void
}
