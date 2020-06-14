import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'

const Profile = () => {
  const { state, dispatch } = useContext(UserContext)
  const [myPics, setMyPics] = useState([])
  const [image, setImage] = useState('')

  useEffect(() => {
    fetch('/myposts', {
      headers: {
        auth_token: localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((data) => setMyPics(data.myposts))
  }, [])

  useEffect(() => {
    if (image) {
      const data = new FormData()
      data.append('file', image)
      data.append('upload_preset', 'instagram_clone')
      data.append('cloud_name', 'abdoerrahiem')

      fetch('https://api.cloudinary.com/v1_1/abdoerrahiem/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          //console.log(data)
          fetch('/update-pic', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              auth_token: localStorage.getItem('jwt'),
            },
            body: JSON.stringify({
              pic: data.secure_url,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              //console.log(data)
              localStorage.setItem(
                'user',
                JSON.stringify({ ...state, pic: data.pic })
              )

              dispatch({ type: 'UPDATE_PIC', payload: data.pic })
            })
        })
    }
  }, [image, dispatch, state])

  const updatePhoto = (file) => {
    setImage(file)
  }

  return (
    <div style={{ maxWidth: '550px', margin: '0px auto' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '18px 0px',
          borderBottom: '1px solid grey',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div>
            <img
              src={state ? state.pic : 'loading'}
              alt=''
              style={{ width: '160px', height: '160px', borderRadius: '80px' }}
            />
          </div>
          <div>
            <h4>{state && state.name}</h4>
            <h5>{state && state.email}</h5>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '108%',
              }}
            >
              <h6>
                {myPics.length === 0
                  ? 'No posts'
                  : myPics.length === 1
                  ? `1 post`
                  : `${myPics.length} posts`}
              </h6>
              <h6>
                {!state
                  ? ''
                  : state.followers.length === 0
                  ? '0 follower'
                  : state.followers.length === 1
                  ? `1 follower`
                  : `${state.followers.length} followers`}
              </h6>
              <h6>
                {!state
                  ? ''
                  : state.following.length === 0
                  ? '0 following'
                  : state.following.length === 1
                  ? `1 following`
                  : `${state.following.length} following`}
              </h6>
            </div>
          </div>
        </div>
        <div className='file-field input-field' style={{ margin: '10px' }}>
          <div className='btn blue darken-2'>
            <span>Upload pic</span>
            <input
              type='file'
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
          </div>
          <div className='file-path-wrapper'>
            <input type='text' className='file-path validate' />
          </div>
        </div>
      </div>
      <div className='gallery'>
        {myPics.map((item) => (
          <img
            className='item'
            src={item.photo}
            alt={item.title}
            key={item._id}
          />
        ))}
      </div>
    </div>
  )
}

export default Profile
