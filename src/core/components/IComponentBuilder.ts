import IComponent from './IComponent.js'

export default interface IComponentBuilder {
  readonly type: string

  buildFromJson(json: any): IComponent
}
