import React, { useEffect, createContext, useReducer, useContext } from 'react'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import './App.css'

import Navbar from './components/Navbar'
import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import FollowingPosts from './components/screens/FollowingPosts'

import { initialState, reducer } from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { dispatch } = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) return history.push('/login')

    dispatch({ type: 'USER', payload: user })
    // history.push('/')
  }, [dispatch, history])

  return (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/profile' component={Profile} />
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/create' component={CreatePost} />
      <Route exact path='/profile/:userId' component={UserProfile} />
      <Route exact path='/following-posts' component={FollowingPosts} />
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
