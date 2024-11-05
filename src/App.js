

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useReducer, createContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-bootstrap'
import userReducer from './reducers/user';
import NavBar from './components/navbar/navbar'
import Register from './components/user/register';
import Login from './components/user/login';
import { ToastContainer } from 'react-toastify'
import Dashboard from './components/user/dashbard';
import axiosInstance from './config/axios';
import Welcome from './components/tasks/Welcome';
export const UserContext = createContext()
function App() {
  const [userState, userDispatch] = useReducer(userReducer, { user: {}, Tasks: [] })
  
  useEffect(() => {
    (async () => {
      try {
        const profile = await axiosInstance.get('/api/getprofile')
        const user = profile.data
        if (user) {
          userDispatch({ type: 'USER_LOGIN', payload: user })
        }
      } catch (e) {
        console.log(e)
      }
    }
    )()
  }, [])

  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/' element={<Welcome />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </UserContext.Provider>
  );
}
export default App;
