import React from 'react'

const RecentActivity = ({ events }) => {
  return (
    <section className='rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md'>
      <h2 className='mb-3 text-lg font-semibold text-white'>Recent Activity</h2>
      <div className='max-h-[320px] space-y-3 overflow-y-auto pr-1'>
        {events.map((event) => (
          <div key={event.id} className='flex items-start justify-between gap-3 rounded-xl bg-black/20 px-3 py-2.5 transition-all duration-300 hover:bg-black/30'>
            <div>
              <p className='font-medium text-white'>{event.title}</p>
              <p className='text-sm text-white/70 line-clamp-1'>{event.detail}</p>
            </div>
            <span className='whitespace-nowrap text-xs text-emerald-200'>{event.time}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RecentActivity
