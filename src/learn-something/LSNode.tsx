import React, { useState } from 'react'
import { LearnSomethingNode } from '../model/learn-something'
import './LSNode.css'

export function LSNode({ node }: { node: LearnSomethingNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="knowledge-node">
      <p onClick={() => setIsOpen(!isOpen)} className="knowledge-node-title">
        {node.topic}
      </p>
      <div className={`knowledge-node-details${isOpen ? '-open' : ''}`}>
        <p className="knowledge-node-summary">{node.lesson}</p>
      </div>
    </div>
  )
}
