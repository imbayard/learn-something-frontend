import React, { useEffect, useState } from 'react'
import { fetchLearnSomethings } from '../api'

export function LearnSomething({ email }: { email: string }) {
  useEffect(() => {
    async function loadPage() {
      const ls = await fetchLearnSomethings(email)
    }
    loadPage()
  }, [])
  return (
    <div>
      <h1>Learn Something!</h1>
    </div>
  )
}
