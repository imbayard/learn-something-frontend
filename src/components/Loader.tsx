import React from 'react'
import './Loader.css'

export default function Loader({ message }: { message: string }) {
  return (
    <div className="loader-wrap">
      <div className="loader"></div>
      <p>{message}</p>
    </div>
  )
}

export function LoaderButton({
  message,
  isLoading,
  handleSubmit,
  buttonText,
}: {
  message: string
  isLoading: boolean
  handleSubmit: () => void
  buttonText: string
}) {
  return !isLoading ? (
    <button onClick={() => handleSubmit()} className="loader-button">
      {buttonText}
    </button>
  ) : (
    <Loader message={message} />
  )
}
