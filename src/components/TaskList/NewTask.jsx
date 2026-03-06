import React from 'react'

const NewTask = () => {
  return (
    <div className='flex-shrink-0 h-full w-[300px] rounded-xl bg-red-400 p-5 text-black'>
      <div className='flex items-center justify-between'>
        <h3 className='rounded bg-red-600 px-3 py-1 text-sm'>High</h3>
        <h4 className='text-sm'>6 Mar 2026</h4>
      </div>
      <h2 className='mt-5 text-2xl font-semibold'>Prepare report</h2>
      <p className='mt-2 text-sm'>
        Compile weekly status report and share it with the team.
      </p>
    </div>
  )
}

export default NewTask
