import React from 'react'

const FailedTask = () => {
  return (
    <div className='flex-shrink-0 h-full w-[300px] rounded-xl bg-red-400 p-5 text-black'>
      <div className='flex items-center justify-between'>
        <h3 className='rounded bg-red-600 px-3 py-1 text-sm'>Overdue</h3>
        <h4 className='text-sm'>6 Mar 2026</h4>
      </div>
      <h2 className='mt-5 text-2xl font-semibold'>Fix payment bug</h2>
      <p className='mt-2 text-sm'>
        Investigate and resolve payment mismatch issue in checkout.
      </p>
    </div>
  )
}

export default FailedTask
