import React, { useEffect, useRef } from 'react'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf'

function PDFViewer({ url }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const loadingTask = getDocument(url)
    loadingTask.promise.then(async (pdf) => {
      const numPages = pdf.numPages

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const viewport = page.getViewport({ scale: 1 })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width

        containerRef.current.appendChild(canvas)

        page.render({ canvasContext: context, viewport })
      }
    })
  }, [url])

  return <div ref={containerRef} />
}

export default PDFViewer
