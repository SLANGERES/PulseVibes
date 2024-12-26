import React from 'react'

export const Header = () => {
  return (
    <div className="flex h-16 w-100vw items-center mt-4 justify-between rounded-full border shadow-xl ml-2 mr-2">
        <div className="pl-7 w-fit"><h1 class="text-3xl">PulseVibe</h1></div>
        <div className="flex space-x-10 w-fit pr-8">
            <span className="cursor-pointer hover:text-sky-700">About</span>
            <span className="cursor-pointer hover:text-sky-700">Find Song</span>
            <span className="cursor-pointer hover:text-sky-700">Guide</span>
            <span className="cursor-pointer hover:text-sky-700">Contribute</span>
        </div>
    </div>
    
  )
}
