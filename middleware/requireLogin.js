const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res, next) => {
  const { auth_token } = req.headers

  if (!auth_token)
    return res.status(401).json({ error: 'You must be logged in!' })

  jwt.verify(auth_token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: 'You must be logged in!' })

    const { _id } = user
    User.findById(_id).then((userData) => {
      req.user = userData
      next()
    })
  })
}
