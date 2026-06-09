import {createBrowserRouter} from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Protected from './features/auth/components/Protected'
import JetpackPanel from './features/auth/pages/JetpackPanel'

export const router = createBrowserRouter([
     {
        path:'/',
        element:<Protected><JetpackPanel/></Protected>
     },
     {
        path:'/login',
        element:<Login/>
     },
     {
        path:'/register',
        element:<Register/>
     }
])