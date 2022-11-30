
enum Code {
  FR = 'FR',
  PT = 'PT',
  EN = 'EN',
  ES = 'ES'
}

type Message = {
  id: number
  code: Code
  text: string
}
const messages: Message[] = [
  {
    id: 0,
    code: Code.FR,
    text: 'Allez les lions!',
  },
  {
    id: 1,
    code: Code.FR,
    text: "Impossible n'est pas camerounais!",
  },
  {
    id: 2,
    code: Code.PT,
    text: 'Força equipa'
  },
  {
    id: 3,
    code: Code.EN,
    text: 'Go for the win!'
  },
  {
    id: 4,
    code: Code.PT,
    text: "Que vença o melhor time"
  }
  ,
  {
    id: 5,
    code: Code.ES,
    text: "Hasta el final, ¡vamos!"
  }
  
]
export {messages}