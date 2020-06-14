const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const requireLogin = require('../middleware/requireLogin')

router.get('/allposts', requireLogin, (req, res) => {
  Post.find()
    .populate('postedBy', '_id name')
    .populate('comments.postedBy', '_id name')
    .then((posts) => res.json({ posts }))
    .catch((err) => console.log(err))
})

router.get('/followingposts', requireLogin, (req, res) => {
  // if postedBy in following
  Post.find({ postedBy: { $in: req.user.following } })
    .populate('postedBy', '_id name')
    .populate('comments.postedBy', '_id name')
    .then((posts) => res.json({ posts }))
    .catch((err) => console.log(err))
})

router.post('/create-post', requireLogin, (req, res) => {
  const { title, body, pic } = req.body

  if (!title || !body || !pic)
    return res.status(422).json({ error: 'Please add all the fields!' })
  //console.log(req.user)

  req.user.password = undefined
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  })

  post
    .save()
    .then((post) => res.json({ post }))
    .catch((err) => console.log(err))
})

router.get('/myposts', requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate('postedBy', '_id, name')
    .then((myposts) => res.json({ myposts }))
    .catch((err) => console.log(err))
})

router.put('/like', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, data) => {
    if (err) return res.status(422).json({ error: err })

    res.json(data)
  })
})

router.put('/unlike', requireLogin, (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.body.postId },
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, data) => {
    if (err) return res.status(422).json({ error: err })

    res.json(data)
  })
})

router.put('/comment', requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  }

  Post.findOneAndUpdate(
    { _id: req.body.postId },
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, data) => {
      if (err) return res.status(422).json({ error: err })

      res.json(data)
    })
})

router.delete('/delete-post/:postId', requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate('postedBy', '_id')
    .exec((err, post) => {
      if (err || !post) return res.status(422).json({ error: err })

      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((data) => res.json(data))
          .catch((err) => console.log(err))
      }
    })
})

module.exports = router
