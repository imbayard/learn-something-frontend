import { useParams } from 'react-router-dom'
import React from 'react'
import { LearnSomethingNode } from '../model'
import { learnSomethingTree } from '../samples/learn-something'
import './LearnSomethingNode.css'

function getNodeFromPath(path: string): LearnSomethingNode | undefined {
  const idPath = path.split('+')
  let nodes: LearnSomethingNode[] | undefined = learnSomethingTree
  let node: LearnSomethingNode | undefined = undefined
  idPath.forEach((id) => {
    const next = nodes?.find((src) => src.id === id)
    node = next
    nodes = next?.nodes
  })
  return node
}

export function LearnSomethingNodeComponent() {
  const { id } = useParams()
  const node = getNodeFromPath(id || '')
  if (node) {
    return (
      <div className="learn-something-node">
        <div className="learn-something-topic">{node.topic}</div>
        <div className="learn-something-lesson">
          {node.lesson.split('.').map((sentence) => (
            <span className="learn-something-lesson-sentence">{sentence}.</span>
          ))}
        </div>
        <div className="learn-something-subtopics">
          <div className="study-next">Study Next:</div>
          {node.suggested_subtopics}
        </div>
      </div>
    )
  } else {
    return <div>Welcome!</div>
  }
}
