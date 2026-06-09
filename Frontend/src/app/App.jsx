import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
import { useauth } from './features/auth/hook/useauth.js'

function App() {

  const {handlegetme}=useauth()
  useEffect(()=>{
    handlegetme().catch((err) => {
      console.log("No active user session detected (clean boot).")
    })
  },[])

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
