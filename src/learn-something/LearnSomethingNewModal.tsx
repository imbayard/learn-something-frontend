import { Button, Modal } from 'antd'
import React from 'react'
import LearnSomethingForm from './LearnSomethingForm'
import { LearnSomethingNode } from '../model'

interface LearnSomethingNewModalProps {
  isModalVisible: boolean
  handleCancel: () => void
  email: string
  setLearnSomethingRoots: React.Dispatch<
    React.SetStateAction<LearnSomethingNode[]>
  >
  parentId?: string
}

export function LearnSomethingNewModal({
  isModalVisible,
  handleCancel,
  email,
  setLearnSomethingRoots,
  parentId,
}: LearnSomethingNewModalProps) {
  return (
    <Modal
      title="Learn Something!"
      open={isModalVisible}
      closeIcon={false}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
      destroyOnClose={true}
    >
      <LearnSomethingForm
        email={email}
        setLearnSomethingRoots={setLearnSomethingRoots}
        parentId={parentId}
      />
    </Modal>
  )
}
