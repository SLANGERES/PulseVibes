import React from 'react'
import IMG from '../assets/footerIMG.png'
export const Footer = () => {
  return (
    <div className="font-light w-full h-[300px] bg-black text-white flex" >
        <div className='flex 1'>
            
        </div>
        <div className='flex-none w-[100px]'></div>

        <div className='text-white font-sans flex-none text-4xl   text-left w-[400px] mt-14'> The world isn't perfect. But it's there for us, doing the best it can. And that's what makes it so damn beautiful.</div>
        <div className='h-[250px] bg-white w-1 mt-5'>

        </div>


        <div className="flex-none w-[200px]">
         
        </div>
        <div className='flex-1 mt-14'>
            <div className='font-sans text-xl'>I hope you like this project. If you do, please consider contributing and giving a star to support its improvement.</div>
            <div className='ml-[350px] mt-4'><a className='font-sans' href="mailto:karannautiyal22@gmail.com">karannautiyal22@gmail.com</a></div>
            <button className='ml-[400px] mt-4 border p-4'><a href="https://github.com/SLANGERES/PulseVibes">GIVE ME A STAR</a></button>
        </div>
        

    </div>
  )
}
