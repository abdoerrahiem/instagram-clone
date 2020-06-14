import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'

const Profile = () => {
  const { state, dispatch } = useContext(UserContext)
  const [userProfile, setUserProfile] = useState(null)

  const { userId } = useParams()
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userId) : true
  )

  //   console.log(userId)
  //   console.log(userProfile)

  useEffect(() => {
    fetch(`/user/${userId}`, {
      headers: {
        auth_token: localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setUserProfile(data)
      })
  }, [userId])

  const followUser = () => {
    fetch('/follow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        auth_token: localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: 'UPDATE',
          payload: {
            following: data.following,
            followers: data.followers,
          },
        })

        localStorage.setItem('user', JSON.stringify(data))
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          }
        })
        setShowFollow(false)
      })
  }

  const unfollowUser = () => {
    fetch('/unfollow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        auth_token: localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: 'UPDATE',
          payload: {
            following: data.following,
            followers: data.followers,
          },
        })

        localStorage.setItem('user', JSON.stringify(data))
        setUserProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          )

          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          }
        })
        setShowFollow(true)
      })
  }

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: '550px', margin: '0px auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              margin: '18px 0px',
              borderBottom: '1px solid grey',
            }}
          >
            <div>
              <img
                src={userProfile.user.pic}
                alt=''
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '80px',
                }}
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '108%',
                }}
              >
                <h6>
                  {userProfile.posts.length === 0
                    ? 'No posts'
                    : userProfile.posts.length === 1
                    ? `1 post`
                    : `${userProfile.posts.length} posts`}
                </h6>
                <h6>
                  {!userProfile.user.followers
                    ? '0 follower'
                    : userProfile.user.followers.length === 1
                    ? `1 follower`
                    : `${userProfile.user.followers.length} followers`}
                </h6>
                <h6>
                  {!userProfile.user.following
                    ? '0 following'
                    : `${userProfile.user.following.length} following`}
                </h6>
              </div>
              {showFollow ? (
                <button
                  style={{ margin: '10px' }}
                  className='btn waves-effect waves-light blue darken-1'
                  type='submit'
                  onClick={followUser}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{ margin: '10px' }}
                  className='btn waves-effect waves-light blue darken-1'
                  type='submit'
                  onClick={unfollowUser}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>
          <div className='gallery'>
            {userProfile.posts.map((item) => (
              <img
                className='item'
                src={item.photo}
                alt={item.title}
                key={item._id}
              />
            ))}
          </div>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </>
  )
}

export default Profile
