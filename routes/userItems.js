const express = require('express')
const router = express.Router()

module.exports = (connection) => {
  router.post('/login', (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' })
    }

    connection.query(
      'SELECT id FROM user WHERE username = ? AND password = ?',
      [username, password],
      (err, results) => {
        if (err) {
          console.error('Error executing query: ' + err.stack)
          return res.status(500).json({ error: 'Internal server error' })
        }

        if (results.length === 0) {
          return res.status(401).json({ error: 'Invalid credentials' })
        }
        if (results.length === 1) {
          req.session.userID = results
          console.log(req.session.userID)
          res.status(200).json(results)
        }
      }
    )
  })

  router.get('/profile', (req, res) => {
    if (req.session.userID) res.status(200).json(req.session.userID)
    else res.status(401).json({ message: 'Unauthorized! Please log in.' })
  })

  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err)
      }
      res.status(200).send('Logout Success')
    })
  })

  return router
}
