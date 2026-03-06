import React, { memo, useMemo } from 'react'
import { PRIORITY_BADGE_CLASSES, STATUS_CARD_CLASSES, TASK_STATUS } from '../../utils/taskUtils'

const TaskCard = memo(({ task, index }) => (
  <article
    style={{ animationDelay: `${index * 50}ms` }}
    className={`task-card rounded-xl p-4 text-black shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
      STATUS_CARD_CLASSES[task.status] || STATUS_CARD_CLASSES[TASK_STATUS.NEW]
    }`}
  >
    <div className='flex items-center justify-between'>
      <h4
        className={`rounded px-2.5 py-1 text-xs transition-transform duration-300 hover:scale-105 ${
          PRIORITY_BADGE_CLASSES[task.priority] || PRIORITY_BADGE_CLASSES.Low
        }`}
      >
        {task.priority}
      </h4>
      <span className='text-xs'>{task.date}</span>
    </div>
    <h2 className='mt-3 text-lg font-semibold'>{task.title}</h2>
    <p className='mt-1 text-sm'>{task.description}</p>
  </article>
))

TaskCard.displayName = 'TaskCard'

const TaskList = ({ tasks, status = TASK_STATUS.ALL }) => {
  const visibleTasks = useMemo(() => {
    if (!status || status === TASK_STATUS.ALL) return tasks
    return tasks.filter((task) => task.status === status)
  }, [status, tasks])

  return (
    <section className='mt-10'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-white'>Task Board</h2>
        <span className='rounded-full bg-white/10 px-3 py-1 text-xs text-white/85'>{visibleTasks.length} Visible</span>
      </div>

      {visibleTasks.length === 0 && (
        <div className='rounded-xl border border-white/20 bg-white/10 px-6 py-5 text-sm text-white'>
          No tasks found for this filter.
        </div>
      )}

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {visibleTasks.map((task, index) => <TaskCard key={task.id} task={task} index={index} />)}
      </div>
    </section>
  )
}

export default memo(TaskList)
