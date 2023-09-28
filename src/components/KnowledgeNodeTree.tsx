import React, { useMemo, useState } from 'react'
import { Input, Tree } from 'antd'
import type { DataNode } from 'antd/es/tree'
import { learnSomethingTree } from '../samples/learn-something'
import { convertToDataNode } from '../lib/learn-something-util'
import './KnowledgeNodeTree.css'
import { TreeNode } from '../model'
import { useNavigate } from 'react-router-dom'

const { Search } = Input
const defaultData: TreeNode[] = convertToDataNode(learnSomethingTree)

const dataList: TreeNode[] = []
const generateList = (
  data: TreeNode[],
  parentId?: React.Key,
  fullPath?: string
) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const { key } = node
    const path = generateNodePath(fullPath || key.toString(), node)
    dataList.push({
      key,
      title: (node.title as string) || '',
      parentId,
      fullPath: path,
      children: node.children,
    })
    if (node.children) {
      generateList(node.children, key, path)
    }
  }
}

const generateNodePath = (fullpath: string, data: TreeNode) => {
  if (data.parentId) {
    return `${fullpath}+${data.key}`.toString()
  } else {
    return data.key.toString()
  }
}

generateList(defaultData)

const getParentKey = (key: React.Key): React.Key | undefined => {
  const node = dataList.find((item) => item.key === key)
  return node ? node.parentId : undefined
}

export const KnowledgeNodeTree: React.FC = () => {
  const navigate = useNavigate()
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [autoExpandParent, setAutoExpandParent] = useState(true)

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    const key = selectedKeys[0]
    const selectedNode = dataList.find((item) => item.key === key)
    if (selectedNode && selectedNode.fullPath) {
      navigate(`/${selectedNode.fullPath}`)
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
      if (item.title.indexOf(value) > -1) {
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
  }, [searchValue])

  return (
    <div className="knowledge-node-tree">
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
    </div>
  )
}
