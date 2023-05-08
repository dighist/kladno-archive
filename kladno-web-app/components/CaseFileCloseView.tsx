import type { CaseFileDocument, CaseFile } from 'lib/sanity.queries'
import BackArrow from './BackArrow'
import ForwardArrow from './ForwardArrow'
import next from 'next/types'

export default function CaseFileCloseView(props: {
  case: CaseFileDocument
  setFileSelected: any
  setSelectedFile: any
  fullFile: CaseFile
}) {
  const goForward = () => {
    let curId = props.case._id.split('-')[3]
    let nextId = parseInt(curId) + 1
    if (nextId > props.fullFile.documents.length - 1) {
      nextId = parseInt(curId)
    }
    props.setSelectedFile(props.fullFile.documents[nextId])
  }

  const goBackwards = () => {
    let curId = props.case._id.split('-')[3]
    let nextId = parseInt(curId) - 1
    if (nextId < 0) {
      nextId = parseInt(curId)
    }
    props.setSelectedFile(props.fullFile.documents[nextId])
  }

  return (
    <div className="fixed top-0 left-0 flex h-screen w-full items-center justify-center bg-dark bg-opacity-80 backdrop-blur-sm">
      <div className="relative h-screen w-4/12 p-8 pr-24 text-lightgrey">
        <div className="text-xl">Document Title</div>
        <div className="mt-24 font-mono">
          <hr />
          <div className="my-2 flex w-full">
            <div className="w-32">Date: </div>
            <div> {props.case.date}</div>
          </div>
          <hr />
          <div className="space my-2 flex w-full">
            <div className="w-32">Filename: </div>
            <div> {props.case.originalFilename}</div>
          </div>
          <hr />
        </div>
      </div>

      <div className="relative flex h-screen w-4/12 items-center">
        <img
          src={props.case.scan}
          className="m-auto h-5/6 object-contain object-center"
        ></img>
        <div className="absolute top-8 flex h-6 w-full justify-between  px-8  text-lightgrey hover:cursor-pointer ">
          <span
            onClick={() => {
              goBackwards()
            }}
            className="text-3xl"
          >
            ↩
          </span>

          <svg
            onClick={() => props.setFileSelected(false)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 10"
          >
            <path d="M0 0 L20 10 M20 0 L0 10" stroke="white" stroke-width="2" />
          </svg>

          <span
            onClick={() => {
              goForward()
            }}
            className="text-3xl"
          >
            ↪
          </span>
        </div>
      </div>

      <div className="relative flex h-screen w-4/12 p-8 pl-24 text-lightgrey">
        <div className="text-xl">Document Context</div>
      </div>
    </div>
  )
}
