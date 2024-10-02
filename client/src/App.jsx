import React from 'react'
import { Button } from './components/ui/button'

const App = () => {
  return (
    <div>
      <h1>Kanstars Vision Global Learning Academy </h1>
      <div className='flex p-5 items-center justify-between'>
      <Button className="bg-green-600">Register</Button>
      <Button className="bg-blue-600">Login</Button>
      </div>
    </div>
  )
}

export default App
