const express = require('express')
const router = express.Router()

module.exports = (connection) => {
  //? Create User
  router.post('/user', async (req, res) => {
    const { username, password } = req.body

    try {
      connection.query(
        'INSERT INTO user (id, username, password) VALUES (?, ?, ?)',
        ['', username, password],
        (err) => {
          if (err) {
            console.log('Error Inserting a user, ', err)
            return res.status(400).send()
          }
          res.status(201).json({ message: 'New user Successfully created' })
        }
      )
    } catch (error) {
      console.log(error)
      return res.status(500).send()
    }
  })

  //? Create Post
  router.post('/post', async (req, res) => {
    const { userId, title, content } = req.body

    try {
      connection.query(
        'INSERT INTO post (id, user_id, title, content, created_at) VALUES (?, ?, ?, ?, current_timestamp())',
        ['', userId, title, content],
        (err) => {
          if (err) {
            console.log('Error Inserting a Post, ', err)
            return res.status(400).send()
          }
          res.status(201).json({ message: 'New Post Successfully created' })
        }
      )
    } catch (error) {
      console.log(error)
      return res.status(500).send()
    }
  })

  //? Create comment
  router.post('/comment', async (req, res) => {
    const { postId, userId, content } = req.body

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
