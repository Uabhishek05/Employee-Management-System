import React from 'react'

const AnalyticsSection = ({ distributionData, productivityData, performanceData = [], totalTasks }) => {
  const pieStops = distributionData.reduce(
    (acc, item) => {
      const start = acc.offset
      const end = start + item.percentage
      acc.offset = end
      acc.stops.push(`${item.color} ${start}% ${end}%`)
      return acc
    },
    { offset: 0, stops: [] }
  )

  const hasPerformance = performanceData.length > 0

  return (
    <section className={`mt-8 grid grid-cols-1 gap-4 ${hasPerformance ? 'xl:grid-cols-3' : 'lg:grid-cols-2'}`}>
      <div className='rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-white'>Task Distribution</h2>
          <span className='rounded-full bg-white/15 px-3 py-1 text-xs text-white/90'>{totalTasks} Total</span>
        </div>
        <div className='flex flex-col items-center gap-4 sm:flex-row sm:items-start'>
          <div
            className='h-32 w-32 rounded-full border-8 border-black/20 shadow-lg'
            style={{ background: `conic-gradient(${pieStops.stops.join(', ')})` }}
          />
          <div className='w-full space-y-2'>
            {distributionData.map((item) => (
              <div key={item.name} className='flex items-center justify-between rounded-lg bg-black/20 px-3 py-1.5'>
                <div className='flex items-center gap-2'>
                  <span className='h-3 w-3 rounded-full' style={{ backgroundColor: item.color }} />
                  <span className='text-sm text-white'>{item.name}</span>
                </div>
                <span className='text-sm font-semibold text-white'>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-white'>Weekly Productivity</h2>
          <span className='rounded-full bg-white/15 px-3 py-1 text-xs text-white/90'>Completed Tasks</span>
        </div>
        <div className='flex h-40 items-end justify-between gap-2'>
          {productivityData.map((day) => (
            <div key={day.day} className='flex flex-1 flex-col items-center gap-1'>
              <div className='w-full rounded-t-md bg-emerald-400/90 shadow-md transition-all duration-300 hover:bg-emerald-300' style={{ height: `${Math.max(day.value * 16, 8)}px` }} />
              <span className='text-xs text-white/85'>{day.day}</span>
              <span className='text-xs font-semibold text-emerald-200'>{day.value}</span>
            </div>
          ))}
        </div>
      </div>

      {hasPerformance && (
        <div className='rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-white'>Employee Performance</h2>
            <span className='rounded-full bg-white/15 px-3 py-1 text-xs text-white/90'>Top Contributors</span>
          </div>
          <div className='space-y-2'>
            {performanceData.map((employee) => (
              <div key={employee.name} className='rounded-lg bg-black/25 px-3 py-2'>
                <div className='mb-1 flex items-center justify-between'>
                  <span className='text-sm font-medium text-white'>{employee.name}</span>
                  <span className='text-xs text-emerald-300'>{employee.score}%</span>
                </div>
                <div className='h-2 rounded-full bg-white/10'>
                  <div className='h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400' style={{ width: `${employee.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default AnalyticsSection
