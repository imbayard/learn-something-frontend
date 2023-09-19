import { DataNode } from 'antd/es/tree'
import { LearnSomethingNode } from '../model/learn-something'

export const convertToDataNode = (
  learnSomething: LearnSomethingNode[]
): DataNode[] => {
  return learnSomething.map((ls) => {
    const children =
      ls.nodes && ls.nodes.length > 0 ? convertToDataNode(ls.nodes) : undefined
    return {
      key: ls.id,
      title: ls.topic,
      children,
      parentId: ls.parentId,
    }
  })
}
