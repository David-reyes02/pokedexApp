import React from 'react'
import { DotWave } from 'ldrs/react'
import 'ldrs/react/DotWave.css'

export const Loader = () => {
  return (
    <div className='container-loader'>
        <DotWave size="47" speed="1" color="black" />
    </div>
   )
}
