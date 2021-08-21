import IComponent from './IComponent.js'
import IComponentBuilder from './IComponentBuilder.js'

export default class ComponentManager {
  private static _registeredBuilders: Record<
    string,
    IComponentBuilder
  > = {}

  static registerBuilder(builder: IComponentBuilder): void {
    ComponentManager._registeredBuilders[builder.type] = builder
  }

  static extractComponent(json: any): IComponent {
    if (json.type) {
      if (ComponentManager._registeredBuilders[json.type]) {
        return ComponentManager._registeredBuilders[
          json.type
        ].buildFromJson(json)
      }
    }

    throw new Error(
      `Component manager error - type is missing or builder is not registered for this type`
    )
  }
}
