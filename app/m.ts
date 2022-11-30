
enum Code {
  FR = 'FR',
  PT = 'PT',
  EN = 'EN',
  SP = 'SP'
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
  {
    code: Code.FR,
    message: "Impossible n'est pas camerounais!",
  },
  {
    code: Code.PT,
    message: 'Força equipa'
  },
  {
    code: Code.EN,
    message: 'Go for the win!'
  },
  {
    code: Code.PT,
    message: "Que vença o melhor time"
  }
]
export {messages}