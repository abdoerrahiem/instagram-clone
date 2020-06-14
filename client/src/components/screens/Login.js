import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../../App'
import M from 'materialize-css'

const Login = () => {
  const { dispatch } = useContext(UserContext)
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const postData = () => {
    if (
      !/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      return M.toast({ html: 'Invalid email', classes: 'red darken-3' })
    }

    fetch('/signin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)

        if (data.error) {
          return M.toast({ html: data.error, classes: 'red darken-3' })
        }

        localStorage.setItem('jwt', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        dispatch({ type: 'USER', payload: data.user })
        M.toast({ html: 'Login success', classes: 'green darken-1' })
        history.push('/')
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className='mycard'>
      <div className='card auth-card'>
        <h2>Instagram</h2>
        <input
          type='email'
          placeholder='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className='btn waves-effect waves-light blue darken-1'
          type='submit'
          onClick={postData}
        >
          Login
        </button>
        <h5>
          <Link to='/signup'>Don't have an account?</Link>
        </h5>
      </div>
    </div>
  )
}

export default Login
