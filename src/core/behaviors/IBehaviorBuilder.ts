import IBehavior from './IBehavior.js'

export default interface IBehaviorBuilder {
  readonly type: string
  buildFromJson(json: any): IBehavior
}
