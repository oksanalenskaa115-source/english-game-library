export interface QuestQuestionData {
  id: string
  sentence: string
  verb: string
  options: [string, string, string]
  correctIndex: 0 | 1 | 2
  hint: string
  explanation: string
}

export interface QuestTopicData {
  id: string
  title: string
  description: string
  questions: QuestQuestionData[]
}
