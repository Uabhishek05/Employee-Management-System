import React from 'react'

const TaskList = ({ tasks }) => {
  const getCardColor = (status) => {
    if (status === 'accepted') return 'bg-blue-400'
    if (status === 'completed') return 'bg-green-400'
    if (status === 'failed') return 'bg-yellow-400'
    return 'bg-red-400'
  }

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'bg-red-700 text-white'
    if (priority === 'Medium') return 'bg-amber-500 text-black'
    return 'bg-emerald-600 text-white'
  }

  return (
    <section className='mt-10'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-white'>Task Board</h2>
        <span className='rounded-full bg-white/10 px-3 py-1 text-xs text-white/85'>{tasks.length} Visible</span>
      </div>

      {tasks.length === 0 && (
        <div className='rounded-xl border border-white/20 bg-white/10 px-6 py-5 text-sm text-white'>
          No tasks found for this filter.
        </div>
      )}

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {tasks.map((task, index) => (
          <article
            key={task.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className={`task-card rounded-xl p-4 text-black shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${getCardColor(task.status)}`}
          >
            <div className='flex items-center justify-between'>
              <h4 className={`rounded px-2.5 py-1 text-xs transition-transform duration-300 hover:scale-105 ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </h4>
              <span className='text-xs'>{task.date}</span>
            </div>
            <h2 className='mt-3 text-lg font-semibold'>{task.title}</h2>
            <p className='mt-1 text-sm'>{task.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TaskList
