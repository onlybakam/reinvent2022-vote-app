
enum Code {
  FR = 'FR'
}

type Message = {
  code: Code
  message: string
}
const messages: Message[] = [
  {
    code: Code.FR,
    message: 'Allez les lions!',
  },
]

// const messageBook: Record<string, Message> = {}
// for (const message of messages) {
//   messageBook[message.code] = message
// }

export {messages}