import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'

const Navbar = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)

  return (
    <nav className='container'>
      <div className='nav-wrapper white'>
        <Link to={state ? '/' : '/login'} className='brand-logo left'>
          Instagram
        </Link>
        <ul id='nav-mobile' className='right'>
          {state ? (
            <>
              <li>
                <Link to='/profile'>Profile</Link>
              </li>
              <li>
                <Link to='/create'>Create Post</Link>
              </li>
              <li>
                <Link to='/following-posts'>My Following Posts</Link>
              </li>

              <li>
                <button
                  className='btn waves-effect waves-light red darken-3'
                  type='submit'
                  onClick={() => {
                    localStorage.clear()
                    dispatch({ type: 'CLEAR' })
                    history.push('/login')
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to='/login'>Login</Link>
              </li>
              <li>
                <Link to='/signup'>Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
