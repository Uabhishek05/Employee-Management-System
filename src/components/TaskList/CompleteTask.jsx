import React from 'react'

const CompleteTask = () => {
  return (
    <div className='flex-shrink-0 h-full w-[300px] rounded-xl bg-green-400 p-5 text-black'>
      <div className='flex items-center justify-between'>
        <h3 className='rounded bg-green-600 px-3 py-1 text-sm'>Done</h3>
        <h4 className='text-sm'>6 Mar 2026</h4>
      </div>
      <h2 className='mt-5 text-2xl font-semibold'>Update onboarding</h2>
      <p className='mt-2 text-sm'>
        Finalize and publish onboarding documentation updates.
      </p>
    </div>
  )
}

export default CompleteTask
