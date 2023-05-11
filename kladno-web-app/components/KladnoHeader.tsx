import Link from 'next/link'
import { AiOutlineArrowRight } from 'react-icons/ai'

export default function KladnoHeader(props) {
  return (
    <>
      <div className="flex w-full justify-between ">
        <h1 className="font-logo text-head text-lightgrey">
          KLADNO ARCHIVE
        </h1>
        <div className="flex space-x-2">
          <p className="text-white font-mono text-smmono">ENG</p>
          <p className="text-semi-dark font-mono text-smmono">CZE</p>
          <p className="text-semi-dark font-mono text-smmono">GER</p>
        </div>
      </div>
    </>
  )
}
