import IMessageHandler from './IMessageHandler.js'
import Message, { MessagePriority } from './Message.js'
import MessageSubscriptionNode from './MessageSubscriptionNode.js'

export default class Transporter {
  private static _subscriptions: Record<string, IMessageHandler[]> =
    {}
  private static _normalQueueMessagePerUpdate: number = 10
  private static _normalMessageQueue: MessageSubscriptionNode[] = []

  private constructor() {}

  static addSubscription(
    code: string,
    handler: IMessageHandler
  ): void {
    if (!Transporter._subscriptions[code]) {
      Transporter._subscriptions[code] = []
    }

    if (!!Transporter._subscriptions[code].includes(handler)) {
      console.warn(
        `Attempting to add a duplicate handler to code: ${code}. Subscription not added.`
      )
      return
    }

    Transporter._subscriptions[code].push(handler)
  }

  static removeSubscription(
    code: string,
    handler: IMessageHandler
  ): void {
    if (!Transporter._subscriptions[code]) {
      console.warn(
        `Attempting to remove a handler from code: ${code}. Subscription does not exist.`
      )
      return
    }

    const index = Transporter._subscriptions[code].indexOf(handler)
    if (index !== -1) {
      Transporter._subscriptions[code].splice(index)
    }
  }

  static post(message: Message): void {
    console.log(`Message posted:`, message)
    const handlers = Transporter._subscriptions[message.code]
    if (!handlers) return

    for (let handler of handlers) {
      if (message.priority === MessagePriority.HIGH) {
        handler.onMessage(message)
      } else {
        Transporter._normalMessageQueue.push(
          new MessageSubscriptionNode(message, handler)
        )
      }
    }
  }

  public static update(time: number): void {
    if (!Transporter._normalMessageQueue.length) return

    const messageLimit = Math.min(
      Transporter._normalQueueMessagePerUpdate,
      Transporter._normalMessageQueue.length
    )

    for (let i = 0; i < messageLimit; i++) {
      const node = Transporter._normalMessageQueue.pop()
      node?.handler.onMessage(node.message)
    }
  }
}
