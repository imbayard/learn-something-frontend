import React, { useEffect, useState } from 'react'
import { fetchLearnSomethings } from '../api'
import { learnSomethingTree } from '../samples/learn-something'
import { container } from '../lib/container'
import { LearnSomethingNode } from '../model/learn-something'
import { LSNode } from './LSNode'

import './LearnSomething.css'

export function LearnSomething({ email }: { email: string }) {
  useEffect(() => {
    async function loadPage() {
      const ls = container.noapi
        ? learnSomethingTree
        : await fetchLearnSomethings(email)
      setLearnSomething(ls)
    }
    loadPage()
  }, [])
  const [learnSomething, setLearnSomething] = useState(
    [] as LearnSomethingNode[]
  )
  return (
    <div className="learn-something-landing">
      <h1 className="learn-something-title">Learn Something!</h1>
      <div className="learn-something-roots">
        {learnSomething.map((ls) => (
          <LSNode node={ls} />
        ))}
      </div>
    </div>
  )
}
