const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const requireLogin = require('../middleware/requireLogin')

router.get('/protected', requireLogin, (req, res) => res.send('Hallo user'))

router.post('/signup', (req, res) => {
  const { name, email, password, pic } = req.body

  if (!name || !email || !password)
    return res.status(422).json({
      error: 'Please add all the fields!',
    })

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser)
        return res.status(422).json({ error: 'User already exist' })

      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
          pic,
        })

        user
          .save()
          .then((user) => res.json({ message: 'User created' }))
          .catch((err) => console.log(err))
      })
    })
    .catch((err) => console.log(err))
})

router.post('/signin', (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res
      .status(422)
      .json({ error: 'Please include the right email and password!' })

  User.findOne({ email })
    .then((savedUser) => {
      if (!savedUser)
        return res.status(422).json({ error: 'Invalid email or password' })

      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (!doMatch)
            return res.status(422).json({ error: 'Invalid email or password' })

          //res.json({ message: 'Successfully signed in' })
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET, {
            noTimestamp: true,
            expiresIn: '1h',
          })
          const { _id, name, email, followers, following, pic } = savedUser
          res.json({
            token,
            user: { _id, name, email, followers, following, pic },
          })
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
})

module.exports = router
