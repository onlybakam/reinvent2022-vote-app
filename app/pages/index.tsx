import Image from 'next/image'
import { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import {
  CheckIcon,
  ChevronUpDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/20/solid'
import { StarIcon } from '@heroicons/react/24/outline'

import Observable from 'zen-observable-ts';

import appsyncImg from '../public/appsync.jpg'
import brazilFlag from '../public/brazil-flag.png'
import cameroonFlag from '../public/cameroon-flag.png'
import values from '../output.json'
import { Amplify, API  } from 'aws-amplify';
import { messages } from './../m'
import * as ops from '../operations'
import { Vote } from '../graphql'

const config = values.ReinventAppSyncJsStack
const entries = Object.entries(config)
const appsyncConfig = entries.reduce((p,[k,v]) => {
  p[`aws_appsync_${k}`] = v
  return p
}, {} as Record<string, string>)
console.log(JSON.stringify(appsyncConfig, null, 2))
Amplify.configure(appsyncConfig)

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const colors = {
  CM: 'yellow',
  BR: 'green'
}

export default function Example() {
  const [selected, setSelected] = useState(messages[0])
  const [teams, setTeams] = useState([
    { id: 1, code: 'BR', name: 'Brazil', stat: 0, img: brazilFlag },
    { id: 2, code: 'CM', name: 'Cameroon', stat: 0, img: cameroonFlag },
  ])
  const [timeline, setTimeline] = useState<Vote[]>([])
  const vote = (code: string) => {
    API.graphql({query: ops.vote, variables: {input:{country: code, guestId: 'random', msgId: selected.id}}})
  }

  type Wrap<T> = {
    value: {
      data: {
        onPlusOne: T
      }
    }
  }
  useEffect(() => {
    const subscription = (API.graphql({query: ops.onPlusOne}) as Observable<Wrap<Vote>>).subscribe({
      next: ({ value }) => {
        console.log(value.data.onPlusOne.country)
        const code = value.data.onPlusOne.country as 'BR' | 'CM'
        setTeams(teams => {
          const team = teams.find(t => t.code === code)
          if (team) {
            team.stat += 1
            return [...teams]
          }
          return teams
        })
        setTimeline(t => ([value.data.onPlusOne, ...t]))
      },
      error: (error) => console.warn(error)
    });
  
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  

  return (
    <>
      <div className="min-h-full">
        <nav className="bg-white border-b border-gray-200">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex items-center flex-shrink-0">
                  <Image src={appsyncImg} className="block w-auto h-8 lg:hidden" alt="appsync" />
                  <Image src={appsyncImg} className="hidden w-auto h-8 lg:block" alt="appsync" />
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-2">
          <main className="px-4">
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
              {/* Replace with your content */}
              <section className="">
                <div className='' >
                  <dl className="grid grid-cols-2 gap-5 mt-5 ">
                    {teams.map((item) => (
                      <div
                        key={item.code}
                        className="relative px-4 pt-5 pb-12 overflow-hidden bg-white rounded-lg shadow sm:px-6 sm:pt-6"
                      >
                        <dt>
                          <div className="absolute p-3 bg-yellow-500 rounded-md">
                            <StarIcon className="w-6 h-6 text-white" aria-hidden="true" />
                          </div>
                          <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                            {item.name}
                          </p>
                        </dt>
                        <dd className="flex items-baseline pb-6 ml-16 sm:pb-7">
                          <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>

                          <div className="absolute inset-x-0 bottom-0 w-full h-8 bg-gray-50">
                            <Image
                              src={item.img}
                              className="object-cover object-center w-full h-full"
                              alt="brazil flag"
                            />
                          </div>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="flex pt-10">
                  <div className="grid shrink-0">
                    <button
                      onClick={(e) => {
                        vote('BR')
                        e.preventDefault()

                      }}
                      type="button"
                      className="inline-flex items-center p-3 mt-auto mr-2 text-sm font-medium leading-4 text-white bg-yellow-600 border border-transparent rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                      <ChevronDoubleLeftIcon className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex-grow w-9/12">
                    <Listbox value={selected} onChange={setSelected}>
                      {({ open }) => (
                        <>
                          <Listbox.Label className="block text-sm font-medium text-center text-gray-700">
                            Cheer for
                          </Listbox.Label>
                          <div className="relative w-full mt-1">
                            <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                              <span className="flex items-center">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full">
                                  {selected.code}
                                </span>
                                <span className="block ml-3 truncate">{selected.text}</span>
                              </span>
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 ml-3 pointer-events-none">
                                <ChevronUpDownIcon
                                  className="w-5 h-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>

                            <Transition
                              show={open}
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-56 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {messages.map((message, index) => (
                                  <Listbox.Option
                                    key={message.text}
                                    className={({ active }) =>
                                      classNames(
                                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                        'relative cursor-default select-none py-2 pl-3 pr-9'
                                      )
                                    }
                                    value={message}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <div className="flex items-center">
                                          <span className="flex-shrink-0 inline-block w-6 h-6 text-center text-white align-middle bg-black rounded-full">
                                            {message.code}
                                          </span>
                                          <span
                                            className={classNames(
                                              selected ? 'font-semibold' : 'font-normal',
                                              'ml-3 block truncate'
                                            )}
                                          >
                                            {message.text}
                                          </span>
                                        </div>

                                        {selected ? (
                                          <span
                                            className={classNames(
                                              active ? 'text-white' : 'text-indigo-600',
                                              'absolute inset-y-0 right-0 flex items-center pr-4'
                                            )}
                                          >
                                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </>
                      )}
                    </Listbox>
                  </div>
                  <div className="grid shrink-0">
                    <button
                    onClick={(e) => {
                      vote('CM')
                      e.preventDefault()

                    }}
                      type="button"
                      className="inline-flex items-center p-3 mt-auto ml-2 text-sm font-medium leading-4 text-white bg-yellow-600 border border-transparent rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                      <ChevronDoubleRightIcon className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </section>

              <section className="mt-8">
                <div className="flow-root">
                  <ul role="list" className="-mb-8">
                    {timeline.map((event, eventIdx) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {eventIdx !== timeline.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={classNames(`bg-${colors[event.country]}-400`,
                                  'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                                )}
                              >
                                <StarIcon className="w-5 h-5 text-white" aria-hidden="true" />
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {event.text}
                                </p>
                              </div>
                              <div className="text-xs font-bold text-right text-gray-500 whitespace-nowrap">
                                <time dateTime={new Date(event.createdAt!).toUTCString()}>{new Date(event.createdAt!).toLocaleTimeString('en-US', {timeStyle: 'short'})}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* /End replace */}
            </div>
          </main>
        </div>
        <div className="hidden bg-yellow-400 bg-green-400"></div>
      </div>
    </>
  )
}
