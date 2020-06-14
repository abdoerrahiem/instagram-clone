const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const User = mongoose.model('User')
const requireLogin = require('../middleware/requireLogin')

router.get('/user/:id', requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select('-password')
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate('postedBy', '_id name')
        .exec((err, posts) => {
          if (err) return res.status(422).json({ error: err })

          res.json({ user, posts })
        })
    })
    .catch((err) => res.status(404).json({ error: 'User not found' }))
})

router.put('/follow', requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, data) => {
      if (err) return res.status(422).json({ error: err })

      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select('-password')
        .then((data) => res.json(data))
        .catch((err) => res.status(422).json({ error: err }))
    }
  )
})

router.put('/unfollow', requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, data) => {
      if (err) return res.status(422).json({ error: err })

      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select('-password')
        .then((data) => res.json(data))
        .catch((err) => res.status(422).json({ error: err }))
    }
  )
})

router.put('/update-pic', requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { pic: req.body.pic },
    },
    { new: true },
    (err, data) => {
      if (err) return res.status(422).json({ error: 'Pic cannot be posted' })

      res.json(data)
    }
  )
})

module.exports = router
