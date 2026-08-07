import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage/HomePage'
import { PlaceholderPage } from './pages/PlaceholderPage/PlaceholderPage'
import { AppShell } from './components/layout/AppShell'
import { MemoryGamePage } from './games/memory/MemoryGamePage'
import { QuestGamePage } from './games/quest/QuestGamePage'
import { StoryboardGamePage } from './games/storyboard/StoryboardGamePage'
import { TeacherPage } from './editor/pages/TeacherPage'
import { TopicWizard } from './editor/pages/TopicWizard'
import { SettingsPage } from './pages/SettingsPage/SettingsPage'
import { ProgressPage } from './pages/ProgressPage/ProgressPage'
import { AchievementsPage } from './pages/AchievementsPage/AchievementsPage'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games/memory/:topicId" element={<MemoryGamePage />} />
        <Route path="/games/quest/:topicId" element={<QuestGamePage />} />
        <Route path="/games/storyboard/:topicId" element={<StoryboardGamePage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/teacher/topic/new" element={<TopicWizard />} />
        <Route path="/teacher/topic/:topicId/edit" element={<TopicWizard />} />
        <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
      </Routes>
    </AppShell>
  )
}

export default App
