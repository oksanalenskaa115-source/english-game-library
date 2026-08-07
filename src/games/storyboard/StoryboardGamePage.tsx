import { useParams } from 'react-router-dom'
import { storyboardTopics } from '../../data/storyboardTopics'
import { PlaceholderPage } from '../../pages/PlaceholderPage/PlaceholderPage'
import { StoryboardGame } from './StoryboardGame'

export function StoryboardGamePage() {
  const { topicId } = useParams()
  const topic = storyboardTopics.find((item) => item.id === topicId)
  if (!topic) return <PlaceholderPage title="Storyboard topic not found" />
  return <StoryboardGame topic={topic} />
}
