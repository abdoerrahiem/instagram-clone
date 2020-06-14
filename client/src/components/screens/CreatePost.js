import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'

const CreatePost = () => {
  const history = useHistory()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [image, setImage] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (url) {
      fetch('/create-post', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          auth_token: localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            return M.toast({ html: data.error, classes: 'red darken-3' })
          }

          M.toast({ html: 'Post created', classes: 'green darken-1' })
          history.push('/')
        })
        .catch((err) => console.log(err))
    }
  }, [url, body, history, title])

  const postDetails = () => {
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

  return (
    <div
      className='card input-field'
      style={{
        margin: '30px auto',
        maxWidth: '500px',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <input
        type='text'
        placeholder='title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type='text'
        placeholder='body'
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className='file-field input-field'>
        <div className='btn blue darken-2'>
          <span>Upload image</span>
          <input type='file' onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className='file-path-wrapper'>
          <input type='text' className='file-path validate' />
        </div>
      </div>
      <button
        className='btn waves-effect waves-light blue darken-2'
        type='submit'
        name='action'
        onClick={postDetails}
      >
        Submit Post
      </button>
    </div>
  )
}

export default CreatePost
