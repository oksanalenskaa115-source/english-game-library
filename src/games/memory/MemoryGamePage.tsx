import { useParams } from 'react-router-dom'
import { memoryTopics } from '../../data/memoryTopics'
import { PlaceholderPage } from '../../pages/PlaceholderPage/PlaceholderPage'
import { MemoryGame } from './MemoryGame'

export function MemoryGamePage() {
  const { topicId } = useParams()
  const topic = memoryTopics.find((item) => item.id === topicId)

  if (!topic) return <PlaceholderPage title="Memory topic not found" />
  return <MemoryGame topic={topic} />
}
