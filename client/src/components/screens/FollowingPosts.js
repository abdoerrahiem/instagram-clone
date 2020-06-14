import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'

const FollowingPosts = () => {
  const { state } = useContext(UserContext)
  const [datas, setDatas] = useState([])

  //console.log(datas)

  useEffect(() => {
    fetch('/followingposts', {
      //method: 'get',
      headers: {
        auth_token: localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((data) => setDatas(data.posts))
      .catch((err) => console.log(err))
  }, [])

  const likePost = (id) => {
    fetch('/like', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        auth_token: localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data)
        const newData = datas.map((item) => {
          if (item._id === data._id) return data

          return item
        })

        setDatas(newData)
      })
      .catch((err) => console.log(err))
  }

  const unlikePost = (id) => {
    fetch('/unlike', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        auth_token: localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newData = datas.map((item) => {
          if (item._id === data._id) return data

          return item
        })

        setDatas(newData)
      })
      .catch((err) => console.log(err))
  }

  const makeComment = (text, postId) => {
    fetch('/comment', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        auth_token: localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data)
        const newData = datas.map((item) => {
          if (item._id === data._id) return data

          return item
        })

        setDatas(newData)
      })
      .catch((err) => console.log(err))
  }

  const deletePost = (postId) => {
    fetch(`/delete-post/${postId}`, {
      method: 'delete',
      headers: {
        auth_token: localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data)
        const newData = datas.filter((item) => item._id !== data._id)

        setDatas(newData)
      })
  }

  // const deleteComment = (commentId) => {
  //   fetch(`/delete-comment/${commentId}`, {
  //     method: 'delete',
  //     headers: {
  //       auth_token: localStorage.getItem('jwt'),
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       //console.log(data)
  //       const newData = datas.filter((item) => item._id !== data._id)

  //       setDatas(newData)
  //     })
  // }

  return (
    <>
      {datas.length > 0 ? (
        datas.map((data) => (
          <div className='home' key={data._id}>
            <div className='card home-card'>
              <h5 style={{ padding: '5px' }}>
                <Link
                  to={
                    data.postedBy._id !== state._id
                      ? `/profile/${data.postedBy._id}`
                      : '/profile'
                  }
                >
                  {data.postedBy.name}
                </Link>{' '}
                {data.postedBy._id === state._id && (
                  <i
                    className='material-icons'
                    style={{ float: 'right' }}
                    onClick={() => deletePost(data._id)}
                  >
                    delete
                  </i>
                )}
              </h5>
              <div className='card-image'>
                <img src={data.photo} alt='' />
              </div>
              <div className='card-content'>
                <i className='material-icons' style={{ color: 'red' }}>
                  favorite
                </i>
                {data.likes.includes(state._id) ? (
                  <i
                    className='material-icons'
                    onClick={() => {
                      unlikePost(data._id)
                    }}
                  >
                    thumb_down
                  </i>
                ) : (
                  <i
                    className='material-icons'
                    onClick={() => {
                      likePost(data._id)
                    }}
                  >
                    thumb_up
                  </i>
                )}

                <h6>
                  {/* {data.likes.length}{' '} */}
                  {data.likes.length === 0
                    ? 'No like'
                    : data.likes.length === 1
                    ? `1 like`
                    : `${data.likes.length} likes`}
                </h6>
                <h6>{data.title}</h6>
                <p>{data.body}</p>
                {data.comments.map((comment) => (
                  <div
                    key={comment._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <h6>
                      <span style={{ fontWeight: '500' }}>
                        {comment.postedBy.name}
                      </span>{' '}
                      {comment.text}
                    </h6>
                    <i
                      className='material-icons'
                      style={{ float: 'right' }}
                      onClick={() => {}}
                    >
                      delete
                    </i>
                  </div>
                ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    //console.log(e.target[0].value)
                    makeComment(e.target[0].value, data._id)
                    e.target[0].value = ''
                  }}
                >
                  <input type='text' placeholder='add a comment...' />
                </form>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  )
}

export default FollowingPosts
