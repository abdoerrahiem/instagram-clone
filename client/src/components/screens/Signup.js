import React, { useState, useEffect, useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState('')
  const [url, setUrl] = useState(undefined)

  const uploadPic = () => {
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', 'instagram_clone')
    data.append('cloud_name', 'abdoerrahiem')

    fetch('https://api.cloudinary.com/v1_1/abdoerrahiem/image/upload', {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setUrl(data.secure_url))
      .catch((err) => console.log(err))
  }

  const uploadFields = useCallback(() => {
    if (
      !/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      return M.toast({ html: 'Invalid email', classes: 'red darken-3' })
    }

    fetch('/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          return M.toast({ html: data.error, classes: 'red darken-3' })
        }

        M.toast({ html: data.message, classes: 'green darken-1' })
        history.push('/login')
      })
      .catch((err) => console.log(err))
  }, [email, history, name, password, url])

  useEffect(() => {
    if (url) {
      uploadFields()
    }
  }, [url, uploadFields])

  const postData = () => {
    if (image) {
      uploadPic()
    } else {
      uploadFields()
    }
  }

  return (
    <div className='mycard'>
      <div className='card auth-card input-field'>
        <h2>Instagram</h2>
        <input
          type='text'
          placeholder='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <div className='file-field input-field'>
          <div className='btn blue darken-2'>
            <span>Upload pic</span>
            <input type='file' onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className='file-path-wrapper'>
            <input type='text' className='file-path validate' />
          </div>
        </div>
        <button
          className='btn waves-effect waves-light blue darken-1'
          type='submit'
          onClick={postData}
        >
          Signup
        </button>
        <h5>
          <Link to='/login'>Already have an account?</Link>
        </h5>
      </div>
    </div>
  )
}

export default Signup
