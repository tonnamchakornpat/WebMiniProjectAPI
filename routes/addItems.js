const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

module.exports = (connection, authenticateToken) => {
  //? Create User
  router.post('/user', async (req, res) => {
    const { username, password } = req.body

    const passwordHash = await bcrypt.hash(password, 10)

    try {
      connection.query(
        'INSERT INTO user (id, username, password) VALUES (?, ?, ?)',
        ['', username, passwordHash],
        (err) => {
          if (err) {
            console.log('Error Inserting a user, ', err)
            return res.status(400).send(err)
          }
          res
            .status(201)
            .json({ message: `New user: ${username} Successfully created` })
        }
      )
    } catch (error) {
      console.log(error)
      return res.status(500).send()
    }
  })

  //? Create Post
  router.post('/post', authenticateToken, async (req, res) => {
    const { title, content } = req.body
    const userId = req.user.id
    // console.log(title, content, userId)
    try {
      connection.query(
        'INSERT INTO post (id, user_id, title, content, created_at) VALUES (?, ?, ?, ?, current_timestamp())',
        ['', userId, title, content],
        (err) => {
          if (err) {
            console.log('Error Inserting a Post, ', err)
            return res.status(400).send(err)
          }
          res.status(201).json({ message: 'Create New Post Successfully' })
        }
      )
    } catch (error) {
      console.log(error)
      return res.status(500).send()
    }
  })

  //? Create comment
  router.post('/comment', authenticateToken, async (req, res) => {
    const { postId, content } = req.body
    const userId = req.user.id

    try {
      connection.query(
        'INSERT INTO `comment` (`id`, `post_id`, `user_id`, `content`, `created_at`) VALUES (?,?,?,?, current_timestamp())',
        ['', postId, userId, content],
        (err) => {
          if (err) {
            console.log('Error Inserting a Comment, ', err)
            return res.status(400).send()
          }
          res
            .status(201)
            .json({ message: 'Add New Comment Successfully created' })
        }
      )
    } catch (error) {
      console.log(error)
      return res.status(500).send()
    }
  })

  return router
}
