import IMessageHandler from './IMessageHandler.js'
import Transporter from './Transporter.js'

export enum MessagePriority {
  NORMAL,
  HIGH,
}

export default class Message {
  code: string
  context: unknown
  sender: unknown
  priority: MessagePriority

  constructor(
    code: string,
    sender: unknown,
    context?: unknown,
    priority: MessagePriority = MessagePriority.NORMAL
  ) {
    this.code = code
    this.sender = sender
    this.context = context
    this.priority = priority
  }

  static send(code: string, sender: unknown, context: unknown): void {
    Transporter.post(
      new Message(code, sender, context, MessagePriority.NORMAL)
    )
  }

  static sendPriority(
    code: string,
    sender: unknown,
    context: unknown
  ): void {
    Transporter.post(
      new Message(code, sender, context, MessagePriority.HIGH)
    )
  }

  static subscribe(code: string, handler: IMessageHandler): void {
    Transporter.addSubscription(code, handler)
  }

  static unsubscribe(code: string, handler: IMessageHandler): void {
    Transporter.removeSubscription(code, handler)
  }
}
