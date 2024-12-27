import React from 'react'

export const Service = () => {
  return (
    <div className='max-w-full w-full h-screen flex justify-center text-center mx-auto flex-col'>
        <h1 className='text-5xl m-20'>
            How you Feeling today
        </h1>
        <div>
            <input className="text-3xl font-extralight border min-w-[800px] h-20 text-center rounded-full hover:shadow-2xl" type="text" placeholder='HOW YOU FEELING ' />
        </div>
        <div className='mt-20'>
            <button className='border rounded-full p-5 hover:shadow-2xl'>FIND SONG FOR ME</button>
        </div>

    </div>
  )
}
