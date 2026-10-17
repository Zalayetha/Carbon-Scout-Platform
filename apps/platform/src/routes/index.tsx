import { createFileRoute } from '@tanstack/react-router'
import { createLogger } from 'logger'
import { apiClient } from '../../../api/src/utils/api-client'

const logger = createLogger({ prefix: 'Platform' })

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    logger.info('Fetching notes in platform loader...')
    try {
      const res = await apiClient.notes.$get()
      const data = await res.json()
      logger.info('Notes fetched successfully', data)
      return data
    } catch (err) {
      logger.error('Failed to fetch notes', err)
      return []
    }
  },
})

function Home() {
  const notes = Route.useLoaderData()
  return (
    <div className="p-8 font-sans">
      <h1 className="text-4xl font-bold text-slate-800">Platform App</h1>
      <p className="mt-2 text-slate-600">
        React + Vite + TanStack Router (File-based Routing)
      </p>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Notes List</h2>
        <div className="space-y-3">
          {notes?.map((note: { id: number; title: string; content: string }) => (
            <div key={note.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="font-medium text-lg">{note.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
