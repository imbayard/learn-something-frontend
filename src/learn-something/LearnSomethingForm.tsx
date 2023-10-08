import React from 'react'
import { Form, Input, Select, Button, InputNumber } from 'antd'
import {
  createNewLearnSomethingChild,
  createNewLearnSomethingRoot,
  fetchLearnSomethings,
} from '../api'
import { LearnSomethingNode } from '../model'
import { useNavigate } from 'react-router-dom'
import { nodeNotFound } from '../samples/learn-something'

export interface LearnSomethingOpts {
  email: string
  topic: string
  numSubtopicsToGenerate?: number
  difficultyLevel?: DifficultyLevelEnum
  typeOfExplanation?: ExplanationTypeEnum
  learningGoal?: LearningGoalEnum
}

export type DifficultyLevelEnum = 'beginner' | 'intermediate' | 'expert'
export type ExplanationTypeEnum =
  | 'general overview'
  | 'in-depth lesson'
  | 'practical example'
export type LearningGoalEnum = 'casual learning' | 'test prep'

interface LearnSomethingFormProps {
  email: string
  setLearnSomethingRoots: React.Dispatch<
    React.SetStateAction<LearnSomethingNode[]>
  >
  parentId?: string
}

const LearnSomethingForm: React.FC<LearnSomethingFormProps> = ({
  email,
  setLearnSomethingRoots,
  parentId,
}) => {
  const navigate = useNavigate()
  const handleSubmit = async (values: LearnSomethingOpts) => {
    console.log('Form values:', values)
    try {
      let res: LearnSomethingNode = nodeNotFound
      if (parentId) {
        res = await createNewLearnSomethingChild({ ...values, email }, parentId)
      } else {
        res = await createNewLearnSomethingRoot({ ...values, email })
      }
      const allRoots = await fetchLearnSomethings(email)
      setLearnSomethingRoots(allRoots)
      navigate(`/${res.id}`)
    } catch (err) {
      console.error(`Error creating learn something: ${err}`)
    }
  }

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        label="Topic"
        name="topic"
        rules={[{ required: true, message: 'Please input a topic!' }]}
      >
        <Input placeholder="Enter a topic" />
      </Form.Item>

      <Form.Item
        label="Number of Subtopics"
        name="numSubtopicsToGenerate"
        rules={[
          {
            type: 'number',
            min: 1,
            max: 3,
            message: 'Please enter a number between 1 and 3!',
          },
        ]}
      >
        <InputNumber placeholder="Enter number of subtopics" min={1} max={3} />
      </Form.Item>

      <Form.Item label="Difficulty Level" name="difficultyLevel">
        <Select placeholder="Select difficulty level">
          <Select.Option value="beginner">Beginner</Select.Option>
          <Select.Option value="intermediate">Intermediate</Select.Option>
          <Select.Option value="expert">Expert</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Type of Explanation" name="typeOfExplanation">
        <Select placeholder="Select type of explanation">
          <Select.Option value="general overview">
            General Overview
          </Select.Option>
          <Select.Option value="in-depth lesson">In-depth Lesson</Select.Option>
          <Select.Option value="practical example">
            Practical Example
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Learning Goal" name="learningGoal">
        <Select placeholder="Select learning goal">
          <Select.Option value="casual learning">Casual Learning</Select.Option>
          <Select.Option value="test prep">Test Prep</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default LearnSomethingForm
