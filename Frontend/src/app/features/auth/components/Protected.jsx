import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

function Protected({children,role=null}) {

    const user = useSelector(state=>state.auth.user)
    const loading =useSelector(state=>state.auth.loading)

    if(loading){
        return <div className="jetpack-loader-container"><div className="ios-spinner"></div></div>
    }

    if(!user){
        return <Navigate to='/login'/>
    }

   if(role && user.role !== role){
    return <Navigate to='/'/>
   }

  return children
}

export default Protected
