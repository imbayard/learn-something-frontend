import { TreeNode } from '../model'
import type React from 'react'

const dataList: TreeNode[] = []

export const generateList = (
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
  return dataList
}

export const generateNodePath = (fullpath: string, data: TreeNode) => {
  if (data.parentId) {
    return `${fullpath}+${data.key}`.toString()
  } else {
    return data.key.toString()
  }
}

export const getParentKey = (key: React.Key): React.Key | undefined => {
  const node = dataList.find((item) => item.key === key)
  return node ? node.parentId : undefined
}
