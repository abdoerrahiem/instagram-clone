const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const { MONGOURI } = require('./keys')
const PORT = 5000

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

mongoose.connection.on('connected', () => console.log('MongoDB connected'))
mongoose.connection.on('error', (err) =>
  console.log('Error when connectiong', err)
)

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes//user'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  )
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
