import Message from './Message.js'

export default interface IMessageHandler {
  onMessage(message: Message): void
}
