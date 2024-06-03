import { AstraHeader } from '@/components'
import React from 'react'

const AboutBoard = () => {
  return (
    <div className="relative z-20 container w-full pb-20">
      <div className="relative sm:mt-0 mt-10 w-full flex flex-col justify-center items-center gap-6">
        <AstraHeader className="text-left w-full">THE BOARD</AstraHeader>
        <div className="text-lg text-justify">
          The Astra Board&apos;s mission is to administer DAO proposals and
          serve the community&apos;s vision. It meets to discuss proposals
          subject to administrative review under Astra DAO rules. The initial
          Board will serve for six months, after which DAO members will vote on
          Board members annually.
        </div>
        <ul className="w-full pl-6">
          <li className="list-disc">Ian Balina</li>
          <li>
            Founder and CEO of Token Metrics; General Partner and Founder of
            Token Metrics Ventures
          </li>
          <li className="list-disc">Ugo Nduaguba </li>
          <li>
            General Partner of Token Metrics Ventures; Founding Member of
            Dreamers DAO
          </li>
          <li className="list-disc">Diego Lara</li>
          <li>
            General Partner of Token Metrics Ventures; Founding Member of
            Dreamers DAO
          </li>
        </ul>
      </div>
    </div>
  )
}

export { AboutBoard }
