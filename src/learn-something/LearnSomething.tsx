import { LearnSomethingNode } from '../model/learn-something'
import React, { useState, useEffect } from 'react'
import { fetchLearnSomethings } from '../api'
import { container } from '../lib/container'
import { learnSomethingTree } from '../samples/learn-something'
import { KnowledgeNodeTree } from '../components/KnowledgeNodeTree'

type LearnSomethingProps = {
  email: string
}

export const LearnSomething: React.FC<LearnSomethingProps> = ({ email }) => {
  const [learnSomethingRoots, setLearnSomethingRoots] = useState(
    [] as LearnSomethingNode[]
  )
  useEffect(() => {
    async function loadPage() {
      const learnSomethingRoots = container.noapi
        ? learnSomethingTree
        : await fetchLearnSomethings(email)
      setLearnSomethingRoots(learnSomethingRoots)
    }
    loadPage()
  }, [])
  return <KnowledgeNodeTree />
}
