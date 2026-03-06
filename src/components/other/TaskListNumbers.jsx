import React from 'react'

const TaskListNumbers = ({ counts, activeFilter, onFilterChange }) => {
  const cards = [
    { key: 'new', label: 'New Task', count: counts.new, color: 'bg-red-400' },
    { key: 'accepted', label: 'Accepted Task', count: counts.accepted, color: 'bg-blue-400' },
    { key: 'completed', label: 'Completed Task', count: counts.completed, color: 'bg-green-400' },
    { key: 'failed', label: 'Failed Task', count: counts.failed, color: 'bg-yellow-400' },
  ]

  return (
    <section className='mt-10'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-white'>Task Summary</h2>
        <button
          type='button'
          onClick={() => onFilterChange('all')}
          className={`rounded-full border px-3 py-1 text-xs transition-all duration-300 ${
            activeFilter === 'all' ? 'border-emerald-300 bg-emerald-400/30 text-emerald-100' : 'border-white/25 bg-white/5 text-white/80 hover:bg-white/10'
          }`}
        >
          Show All
        </button>
      </div>
      <div className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      {cards.map((card) => {
        const isActive = activeFilter === card.key

        return (
          <button
            key={card.key}
            type='button'
            onClick={() => onFilterChange(isActive ? 'all' : card.key)}
            className={`summary-card rounded-xl w-full px-9 py-6 text-left text-black transition-all duration-300 ${card.color} ${
              isActive ? 'ring-4 ring-white/80 scale-[1.02]' : 'ring-0'
            }`}
          >
            <h2 className='text-3xl font-semibold'>{card.count}</h2>
            <h3 className='text-xl font-medium'>{card.label}</h3>
          </button>
        )
      })}
      </div>
    </section>
  )
}

export default TaskListNumbers
