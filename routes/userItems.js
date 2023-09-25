const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const secret_key = process.env.JWT_SECRET_KEY

module.exports = (connection) => {
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: 'Username and password are required' })
      }
      connection.query(
        'SELECT * FROM user WHERE username = ? ',
        [username],
        async (err, results) => {
          if (err) {
            console.error('Error executing query: ' + err.stack)
            return res.status(500).json({ error: 'Internal server error' })
          }

          if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' })
          }

          if (results.length === 1) {
            const userData = results[0]
            const match = await bcrypt.compare(password, userData.password)
            if (!match) {
              res.status(400).json({
                message: 'login fail (wrong username or password',
              })
              return false
            }

            const token = jwt.sign({ username, role: 'user' }, secret_key, {
              expiresIn: '1h',
            })

            res.status(200).json({ message: 'login successful', token })
          }
        }
      )
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: 'Internal server error',
        error: error.message, // Include the error message for debugging purposes
      })
    }
  })

  router.get('/profile', (req, res) => {
    try {
      const authHeader = req.headers['authorization']
      let authToken = ''
      if (authHeader) {
        authToken = authHeader.split(' ')[1]
      }

      const user = jwt.verify(authToken, secret_key)
      console.log(user)

      connection.query(
        `SELECT * FROM user WHERE username = "${user.username}"`,
        (err, res) => {
          if (!res || res.length === 0) {
            throw { message: 'user not found' }
          }
        }
      )
      connection.query('SELECT * FROM user', (err, results) => {
        if (err) {
          res.json({ message: err })
        }
        res.status(200).json(results)
      })
    } catch (error) {
      console.log('error', error)
      res.json({ message: 'Authentication fail', error })
    }
  })

  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err)
      }
      res.status(200).send('Logout Success')
    })
  })

  router.post('/test', (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' })
    }

    // res.sendStatus(200).json({ message: username, password })

    res.status(200).json(req.session.userID)

    // connection.query(
    //   'SELECT id FROM user WHERE username = ? AND password = ?',
    //   [username, password],
    //   (err, results) => {
    //     if (err) {
    //       console.error('Error executing query: ' + err.stack)
    //       return res.status(500).json({ error: 'Internal server error' })
    //     }

    //     if (results.length === 0) {
    //       return res.status(401).json({ error: 'Invalid credentials' })
    //     }
    //     if (results.length === 1) {
    //       req.session.userID = results
    //       console.log(req.session.userID)
    //       res.status(200).json(username, password)
    //     }
    //   }
    // )
  })

  return router
}
