import IBehavior from './IBehavior.js'
import IBehaviorBuilder from './IBehaviorBuilder.js'

export default class BehaviorManager {
  private static _registeredBuilders: Record<
    string,
    IBehaviorBuilder
  > = {}

  static registerBuilder(builder: IBehaviorBuilder): void {
    BehaviorManager._registeredBuilders[builder.type] = builder
  }

  static extractBehavior(json: any): IBehavior {
    if (json.type) {
      if (BehaviorManager._registeredBuilders[json.type]) {
        return BehaviorManager._registeredBuilders[
          json.type
        ].buildFromJson(json)
      }
    }

    throw new Error(
      `Behavior manager error - type is missing or builder is not registered for this type`
    )
  }
}
