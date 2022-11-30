import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon, StarIcon } from '@heroicons/react/24/outline'

import appsyncImg from '../public/appsync.jpg'
import brazilFlag from '../public/brazil-flag.png'
import cameroonFlag from '../public/cameroon-flag.png'


const stats = [
  { id: 1, name: 'Brazil', stat: 0, icon: StarIcon, img: brazilFlag },
  { id: 2, name: 'Cameroon', stat: 0, icon: StarIcon, img: cameroonFlag },
]


const navigation = [
  { name: 'Dashboard', href: '#', current: true },
]
const userNavigation: any[] = []

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">
        <nav className="bg-white border-b border-gray-200">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex items-center flex-shrink-0">
                      <Image src={appsyncImg}
                        className="block w-auto h-8 lg:hidden"
                        alt="appsync"
                      />
                      <Image src={appsyncImg}
                        className="hidden w-auto h-8 lg:block"
                        alt="appsync"
                      />
                    </div>
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'border-indigo-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                 
                  
                </div>
              </div>
        </nav>

        <div className="py-10">
 
          <main className='px-4'>
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
              {/* Replace with your content */}

              <div>

      <dl className="grid grid-cols-2 gap-5 mt-5 ">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative px-4 pt-5 pb-12 overflow-hidden bg-white rounded-lg shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute p-3 bg-yellow-500 rounded-md">
                <item.icon className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
            </dt>
            <dd className="flex items-baseline pb-6 ml-16 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
            
              <div className="absolute inset-x-0 bottom-0 w-full h-8 bg-gray-50">
                  <Image src={item.img} className="object-cover object-center w-full h-full" alt='brazil flag' />
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>

              {/* /End replace */}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

