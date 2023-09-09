export interface LearnSomethingNode {
  email: string
  topic: string
  lesson: string
  suggested_subtopics: string
  nodes: LearnSomethingNode[]
}
