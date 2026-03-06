import React, { memo, useState } from 'react'

const Header = ({
  onLogout = () => {},
  onViewProfile = () => {},
  notifications = [],
  onClearNotifications = () => {},
  panelLabel = 'Employee Panel',
  title = 'Hello, Abhishek',
  profileName = 'Abhishek',
  profileInitial = 'A',
  notificationCount = 3,
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className='sticky top-3 z-20 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 shadow-xl backdrop-blur-md md:px-6'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <p className='text-xs uppercase tracking-[0.2em] text-emerald-200/80'>{panelLabel}</p>
          <h1 className='text-2xl font-semibold text-white'>{title} 👋</h1>
        </div>

        <div className='relative flex items-center justify-end gap-3'>
          <button
            type='button'
            onClick={() => setShowNotifications((prev) => !prev)}
            className='relative rounded-xl border border-white/15 bg-white/10 p-2.5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20'
          >
            <span>🔔</span>
            <span className='absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white'>{notifications.length || notificationCount}</span>
          </button>

          {showNotifications && (
            <div className='absolute right-24 top-20 z-40 w-80 rounded-xl border border-white/15 bg-[#0d1224]/95 p-3 shadow-2xl backdrop-blur-md'>
              <div className='mb-2 flex items-center justify-between'>
                <h3 className='text-sm font-semibold text-white'>Notifications</h3>
                <button type='button' onClick={onClearNotifications} className='text-xs text-emerald-200 hover:text-emerald-100'>
                  Clear
                </button>
              </div>
              <div className='max-h-64 space-y-2 overflow-y-auto'>
                {notifications.length === 0 && (
                  <p className='rounded-lg bg-white/5 px-3 py-2 text-xs text-white/60'>No notifications yet.</p>
                )}
                {notifications.map((item) => (
                  <div key={item.id} className='rounded-lg bg-white/5 px-3 py-2'>
                    <p className='text-xs text-white'>{item.message}</p>
                    <p className='mt-1 text-[11px] text-white/55'>{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='relative'>
            <button
              type='button'
              onClick={() => {
                setShowNotifications(false)
                setShowMenu((prev) => !prev)
              }}
              className='flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 text-white transition-all duration-300 hover:bg-white/20'
            >
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/90 text-sm font-semibold text-black'>{profileInitial}</span>
              <span className='text-sm font-medium'>{profileName}</span>
            </button>

            {showMenu && (
              <div className='absolute right-0 mt-2 w-40 rounded-xl border border-white/15 bg-[#0d1224]/95 p-2 shadow-2xl backdrop-blur-md'>
                <button
                  type='button'
                  onClick={() => {
                    onViewProfile()
                    setShowMenu(false)
                  }}
                  className='w-full rounded-lg px-3 py-2 text-left text-sm text-white/90 transition-colors duration-300 hover:bg-white/10'
                >
                  View Profile
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setShowMenu(false)
                    onLogout()
                  }}
                  className='w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 transition-colors duration-300 hover:bg-red-500/15'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default memo(Header)
