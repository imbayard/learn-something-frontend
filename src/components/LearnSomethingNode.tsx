import { useParams } from 'react-router-dom'
import React, { useState } from 'react'
import { LearnSomethingNode } from '../model'
import { learnSomethingTree } from '../samples/learn-something'
import './LearnSomethingNode.css'
import { LoaderButton } from './Loader'
import { Checkbox, Modal } from 'antd'
import { deleteLearnSomething } from '../api'

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
  const [isDeleting, setIsDeleting] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false) // State for modal visibility
  const [deleteChildren, setDeleteChildren] = useState(false) // State for checkbox value

  const handleDelete = async () => {
    setIsModalVisible(false)
    setIsDeleting(true)
    // Call your async delete function here.

    await deleteLearnSomething(id || '', deleteChildren)
    // You can use the deleteChildren state to determine if children should be deleted.
    setIsDeleting(false)
  }
  if (node) {
    return (
      <div className="learn-something-node">
        <div className="learn-something-node-header">
          <div className="learn-something-topic">{node.topic}</div>
          <LoaderButton
            isLoading={false}
            buttonText="Edit"
            handleSubmit={() => {}}
            message="Edit"
          />
          <LoaderButton
            isLoading={isDeleting}
            buttonText="Delete"
            handleSubmit={() => setIsModalVisible(true)} // Open the modal when clicked
            message="Deleting..."
          />
        </div>
        <div className="learn-something-lesson">
          {node.lesson.split('.').map((sentence) => (
            <span className="learn-something-lesson-sentence">{sentence}.</span>
          ))}
        </div>
        <div className="learn-something-subtopics">
          <div className="study-next">Study Next:</div>
          {node.suggested_subtopics}
        </div>
        <Modal
          title="Delete Node"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={handleDelete}
          okText="Yes"
          cancelText="No"
        >
          <p>Are you sure you want to delete this node?</p>
          <Checkbox
            checked={deleteChildren}
            onChange={(e) => setDeleteChildren(e.target.checked)}
          >
            Delete its children as well?
          </Checkbox>
        </Modal>
      </div>
    )
  } else {
    return <div>Welcome!</div>
  }
}
