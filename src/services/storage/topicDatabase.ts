import type { EditorTopic } from '../../editor/types'

const DATABASE_NAME = 'english-game-library'
const DATABASE_VERSION = 1
const STORES = ['topics', 'images', 'audio', 'memoryPairs', 'questQuestions', 'storyCards'] as const

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      STORES.forEach((storeName) => {
        if (!database.objectStoreNames.contains(storeName)) database.createObjectStore(storeName, { keyPath: 'id' })
      })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function listTopics(): Promise<EditorTopic[]> {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const request = database.transaction('topics', 'readonly').objectStore('topics').getAll()
    request.onsuccess = () => resolve((request.result as EditorTopic[]).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
    request.onerror = () => reject(request.error)
  })
}

export async function getTopic(id: string): Promise<EditorTopic | undefined> {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const request = database.transaction('topics', 'readonly').objectStore('topics').get(id)
    request.onsuccess = () => resolve(request.result as EditorTopic | undefined)
    request.onerror = () => reject(request.error)
  })
}

export async function saveTopic(topic: EditorTopic) {
  const database = await openDatabase()
  const storedTopic = { ...topic, updatedAt: new Date().toISOString() }
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction('topics', 'readwrite')
    transaction.objectStore('topics').put(storedTopic)
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

export async function deleteTopic(id: string) {
  const database = await openDatabase()
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORES, 'readwrite')
    transaction.objectStore('topics').delete(id)
    STORES.slice(1).forEach((storeName) => {
      const request = transaction.objectStore(storeName).openCursor()
      request.onsuccess = () => {
        const cursor = request.result
        if (!cursor) return
        const value = cursor.value as { topicId?: string }
        if (value.topicId === id) cursor.delete()
        cursor.continue()
      }
    })
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}
