import React, { memo } from 'react'

const defaultActions = [
  { key: 'createTask', label: 'Create Task', accent: 'from-indigo-500 to-blue-500' },
  { key: 'assignTask', label: 'Assign Task', accent: 'from-cyan-500 to-sky-500' },
  { key: 'report', label: 'Generate Report', accent: 'from-emerald-500 to-green-500' },
  { key: 'team', label: 'View Team', accent: 'from-orange-500 to-amber-500' },
]

const QuickActions = ({ actions = defaultActions, title = 'Quick Actions', activeAction = '', onActionClick = () => {} }) => {
  return (
    <section className='mt-8'>
      <h2 className='mb-4 text-lg font-semibold text-white'>{title}</h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
        {actions.map((action) => (
          <button
            key={action.key || action.label}
            type='button'
            onClick={() => onActionClick(action.key)}
            className={`rounded-xl border border-white/20 bg-gradient-to-r ${action.accent} px-5 py-4 text-left font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
              activeAction === action.key ? 'ring-2 ring-white/80 scale-[1.01]' : ''
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  )
}

export default memo(QuickActions)
