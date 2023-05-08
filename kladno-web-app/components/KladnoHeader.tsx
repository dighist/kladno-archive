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
      <p className="mx-auto mt-28 mb-7 w-1/2 text-center font-serif text-md text-semi-dark">
        Welcome to the Kladno Archive. <br></br>A collaborative online archive
        developed by the Masaryk Institute and Archive of the Czech Academy of
        Sciences in Prague, the Czech National Archives, and the Kladno Museum.
        and the Massachussets Institute of Technology.
        <span className="mx-auto mt-2 flex w-fit items-center space-x-2 font-mono text-smmono hover:cursor-pointer">
          <AiOutlineArrowRight />
          <div>Read more</div>
        </span>
      </p>
    </>
  )
}
