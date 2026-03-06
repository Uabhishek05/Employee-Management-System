import React, { useState } from 'react'

const defaultNavItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '▦' },
  { key: 'tasks', label: 'Tasks', icon: '✓' },
  { key: 'team', label: 'Team', icon: '◉' },
  { key: 'calendar', label: 'Calendar', icon: '▣' },
  { key: 'reports', label: 'Reports', icon: '◌' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
]

const Sidebar = ({
  navItems = defaultNavItems,
  panelLabel = 'EMS',
  panelTitle = 'Workspace',
  activeIndex = 0,
  activeKey = '',
  onNavChange = () => {},
}) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        type='button'
        onClick={() => setMobileOpen(true)}
        className='fixed right-6 top-6 z-40 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-black/60 lg:hidden'
        aria-label='Open sidebar'
      >
        <span className='flex flex-col gap-1'>
          <span className='h-0.5 w-4 rounded bg-white' />
          <span className='h-0.5 w-4 rounded bg-white' />
          <span className='h-0.5 w-4 rounded bg-white' />
        </span>
      </button>

      {mobileOpen && (
        <button
          type='button'
          aria-label='Close sidebar overlay'
          onClick={() => setMobileOpen(false)}
          className='fixed inset-0 z-30 bg-black/50 lg:hidden'
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[250px] flex-col border-r border-white/10 bg-black/45 p-5 backdrop-blur-lg transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className='rounded-xl border border-white/15 bg-white/5 px-4 py-3'>
          <p className='text-xs uppercase tracking-[0.2em] text-emerald-200/80'>{panelLabel}</p>
          <h2 className='mt-1 text-lg font-semibold text-white'>{panelTitle}</h2>
        </div>

        <nav className='mt-6 flex flex-col gap-2'>
          {navItems.map((item, index) => (
            <button
              key={item.key || item.label}
              type='button'
              onClick={() => {
                onNavChange(item.key || item.label.toLowerCase())
                setMobileOpen(false)
              }}
              className={`flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-left text-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white ${
                activeKey
                  ? activeKey === (item.key || item.label.toLowerCase())
                    ? 'border-white/20 bg-white/10 text-white shadow-lg shadow-cyan-500/10'
                    : ''
                  : index === activeIndex
                    ? 'border-white/20 bg-white/10 text-white shadow-lg shadow-cyan-500/10'
                    : ''
              }`}
            >
              <span className='inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-sm'>{item.icon}</span>
              <span className='text-sm font-medium'>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
