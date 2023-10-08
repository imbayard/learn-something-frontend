import { LearnSomethingNode } from '../model/learn-something'
import React, { useState, useEffect } from 'react'
import { fetchLearnSomethings } from '../api'
import { container } from '../lib/container'
import { learnSomethingTree } from '../samples/learn-something'
import { KnowledgeNodeTree } from '../components/KnowledgeNodeTree'
import { convertToDataNode } from '../lib/learn-something-util'
import { generateList } from '../lib/tree-utils'
import { TreeNode } from '../model'

type LearnSomethingProps = {
  email: string
}

export const LearnSomething: React.FC<LearnSomethingProps> = ({ email }) => {
  const [learnSomethingRoots, setLearnSomethingRoots] = useState(
    [] as LearnSomethingNode[]
  )
  const [defaultData, setDefaultData] = useState([] as TreeNode[])
  const [dataList, setDataList] = useState([] as TreeNode[])
  useEffect(() => {
    async function loadPage() {
      const learnSomethingRoots = container.noapi
        ? learnSomethingTree
        : await fetchLearnSomethings(email)
      const defData = convertToDataNode(learnSomethingRoots)
      const datList = generateList(defaultData)
      setDefaultData(defData)
      setDataList(datList)
    }
    loadPage()
  }, [])
  return (
    <KnowledgeNodeTree
      email={email}
      setLearnSomethingRoots={setLearnSomethingRoots}
      defaultData={defaultData}
      dataList={dataList}
    />
  )
}
