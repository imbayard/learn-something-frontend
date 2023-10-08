import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { nodeNotFound } from '../samples/learn-something'
import { useNavigate } from 'react-router-dom'
import './LearnSomethingNode.css'
import { LoaderButton } from '../components/Loader'
import { Checkbox, Modal } from 'antd'
import {
  deleteLearnSomething,
  fetchLearnSomethingById,
  fetchLearnSomethings,
} from '../api'
import { LearnSomethingNode } from '../model'

interface LearnSomethingNodeComponentProps {
  email: string
  setTreeData: React.Dispatch<React.SetStateAction<LearnSomethingNode[]>>
}

export function LearnSomethingNodeComponent({
  email,
  setTreeData,
}: LearnSomethingNodeComponentProps) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [doesWantToDeleteChildren, setDeleteChildren] = useState(false)
  const [node, setNode] = useState(nodeNotFound)

  useEffect(() => {
    async function loadPage() {
      const fetched = await fetchLearnSomethingById(id || '', email)
      if (fetched) {
        setNode(fetched)
      } else {
        setNode(nodeNotFound)
      }
    }
    loadPage()
  }, [id])

  const handleDelete = async () => {
    setIsModalVisible(false)
    setIsDeleting(true)

    await deleteLearnSomething(node?.id || '', doesWantToDeleteChildren)
    // You can use the deleteChildren state to determine if children should be deleted.
    setIsDeleting(false)
    setTreeData(await fetchLearnSomethings(email))
    navigate('/')
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
          {node.lesson.split('.').map((sentence, i) => (
            <span key={i} className="learn-something-lesson-sentence">
              {sentence}.
            </span>
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
            checked={doesWantToDeleteChildren}
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
