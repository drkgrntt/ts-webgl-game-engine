import IMessageHandler from './IMessageHandler.js'
import Message from './Message.js'

export default class MessageSubscriptionNode {
  message: Message
  handler: IMessageHandler

  constructor(message: Message, handler: IMessageHandler) {
    this.message = message
    this.handler = handler
  }
}
