import { DataNode } from 'antd/es/tree'

export interface TreeNode extends DataNode {
  key: React.Key
  title: string
  parentId?: React.Key
  fullPath: string
  children: TreeNode[]
}
