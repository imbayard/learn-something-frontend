export interface LearnSomethingNode {
  id: string
  email: string
  topic: string
  lesson: string
  suggested_subtopics: string
  nodes: LearnSomethingNode[]
  parentId?: string
}
