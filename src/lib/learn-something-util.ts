import { LearnSomethingNode } from '../model/learn-something'
import { TreeNode } from '../model'

export const convertToDataNode = (
  learnSomething: LearnSomethingNode[]
): TreeNode[] => {
  return learnSomething.map((ls) => {
    const children =
      ls.nodes && ls.nodes.length > 0 ? convertToDataNode(ls.nodes) : undefined
    return {
      key: ls.id,
      title: ls.topic,
      children: children || [],
      parentId: ls.parentId,
      fullPath: '',
    }
  })
}
