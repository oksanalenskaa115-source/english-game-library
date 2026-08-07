import { useParams } from 'react-router-dom'
import { questTopics } from '../../data/questTopics'
import { PlaceholderPage } from '../../pages/PlaceholderPage/PlaceholderPage'
import { QuestGame } from './QuestGame'

export function QuestGamePage() {
  const { topicId } = useParams()
  const topic = questTopics.find((item) => item.id === topicId)

  if (!topic) return <PlaceholderPage title="Quest topic not found" />
  return <QuestGame topic={topic} />
}
