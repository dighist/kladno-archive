import React from 'react'

export default function PreviewThumb(props) {
  const { title, imageUrl } = props

  return (
    <>
      {imageUrl && <img src={imageUrl} alt={title} />}
      <h2>{title || 'Untitled'}</h2>
    </>
  )
}
