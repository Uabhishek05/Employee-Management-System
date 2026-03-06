import React, { memo } from 'react'

const UpcomingDeadlines = ({ tasks }) => {
  return (
    <section className='rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md'>
      <h2 className='mb-3 text-lg font-semibold text-white'>Upcoming Deadlines</h2>
      <div className='max-h-[320px] space-y-3 overflow-y-auto pr-1'>
        {tasks.map((task) => (
          <div key={task.id ?? task.title} className='rounded-xl border border-red-200/20 bg-red-500/10 px-3 py-2.5 transition-all duration-300 hover:border-red-200/40 hover:bg-red-500/20'>
            <div className='flex items-center justify-between'>
              <p className='font-semibold text-white'>{task.title}</p>
              <span className='rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-200'>{task.priority}</span>
            </div>
            <p className='mt-1 text-sm text-white/75'>Due: {task.date}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default memo(UpcomingDeadlines)
