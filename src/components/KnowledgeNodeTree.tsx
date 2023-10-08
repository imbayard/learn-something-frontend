import React, { useMemo, useState } from 'react'
import { Button, Input, Modal, Tree } from 'antd'
import type { DataNode } from 'antd/es/tree'
import './KnowledgeNodeTree.css'
import { LearnSomethingNode, TreeNode } from '../model'
import { useNavigate } from 'react-router-dom'
import LearnSomethingForm from './LearnSomethingForm'
import { LoaderButton } from './Loader'

const { Search } = Input

interface KnowledgeNodeTreeProps {
  email: string
  setLearnSomethingRoots: React.Dispatch<
    React.SetStateAction<LearnSomethingNode[]>
  >
  defaultData: TreeNode[]
  dataList: TreeNode[]
}

export const KnowledgeNodeTree: React.FC<KnowledgeNodeTreeProps> = ({
  email,
  setLearnSomethingRoots,
  defaultData,
  dataList,
}) => {
  const navigate = useNavigate()
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [autoExpandParent, setAutoExpandParent] = useState(true)

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    const key = selectedKeys[0]
    const selectedNode = dataList.find((item) => item.key === key)
    if (selectedNode && selectedNode.key) {
      navigate(`/${selectedNode.key}`)
    }
  }

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys)
    setAutoExpandParent(false)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const newExpandedKeys: React.Key[] = []

    dataList.forEach((item) => {
      if (item.title.toLowerCase().indexOf(value.toLowerCase()) > -1) {
        // Add the key of the matched item
        newExpandedKeys.push(item.key)

        // Add the parentId of the matched item to expand the parent node
        if (item.parentId) {
          newExpandedKeys.push(item.parentId)
        }
      }
    })

    // Filter out duplicates
    const uniqueExpandedKeys = Array.from(new Set(newExpandedKeys))

    setExpandedKeys(uniqueExpandedKeys)
    setSearchValue(value)
    setAutoExpandParent(true)
  }

  const treeData = useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string
        const index = strTitle.indexOf(searchValue)
        const beforeStr = strTitle.substring(0, index)
        const afterStr = strTitle.slice(index + searchValue.length)
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          )
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) }
        }

        return {
          title,
          key: item.key,
        }
      })

    return loop(defaultData)
  }, [searchValue, defaultData])

  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return dataList && dataList.length > 0 ? (
    <div className="knowledge-node-tree">
      <LoaderButton
        buttonText="Learn Something!"
        isLoading={false}
        message=""
        handleSubmit={
          !isModalVisible ? () => showModal() : () => handleCancel()
        }
      />
      <Search
        style={{ marginBottom: 8 }}
        placeholder="Search"
        onChange={onChange}
      />
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        onSelect={onSelect}
      />
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
        />
      </Modal>
    </div>
  ) : (
    <div>Loading...</div>
  )
}
