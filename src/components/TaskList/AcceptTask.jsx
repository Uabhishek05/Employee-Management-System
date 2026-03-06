import React from 'react'

const AcceptTask = () => {
  return (
    <div className='flex-shrink-0 h-full w-[300px] rounded-xl bg-blue-400 p-5 text-black'>
      <div className='flex items-center justify-between'>
        <h3 className='rounded bg-blue-600 px-3 py-1 text-sm'>Medium</h3>
        <h4 className='text-sm'>6 Mar 2026</h4>
      </div>
      <h2 className='mt-5 text-2xl font-semibold'>Client follow-up</h2>
      <p className='mt-2 text-sm'>
        Reach out to the client for feedback on the latest delivery.
      </p>
    </div>
  )
}

export default AcceptTask
