const express = require('express')
const router = express.Router()

module.exports = (connection) => {
  //? Get AllPosts
  router.get('/posts', async (req, res) => {
    try {
      connection.query(
        `
        SELECT
    p.id AS id,
    p.title AS title,
    p.content AS content,
    p.created_at AS created_at,
    p.username AS username,
    COALESCE(comment_count, 0) AS comment_count
FROM
    (SELECT
        post.id,
        post.title,
        post.content,
        post.created_at,
        user.username
    FROM
        post
    INNER JOIN
        user
    ON
        user.id = post.user_id
    ORDER BY
        post.created_at DESC) AS p
LEFT JOIN
    (SELECT
        post_id,
        COUNT(*) AS comment_count
    FROM
        comment
    GROUP BY
        post_id) AS c
ON
    p.id = c.post_id;
        `,
        (err, result) => {
          if (err) {
            console.log('Error Fetching data')
            return res.status(400).send()
          }
          res.status(200).json(result)
        }
      )
    } catch (error) {
      console.error(error)
      return res.status(500).send()
    }
  })

  //? GetMyPost
  router.get('/myposts/:postId', async (req, res) => {
    try {
      userId = req.params.postId
      connection.query(
        `SELECT id,title, content, created_at FROM post
            WHERE user_id ='${userId}' 
            ORDER by created_at ASC`,
        (err, result) => {
          if (err) {
            console.log('Error Fetching data')
            return res.status(400).send()
          }
          res.status(200).json(result)
        }
      )
    } catch (error) {
      console.error(error)
      return res.status(500).send()
    }
  })

  //? GetPost
  router.get('/post/:postId', async (req, res) => {
    try {
      postId = req.params.postId
      //   console.log(postId)
      connection.query(
        `SELECT post.id,post.title, post.content, post.created_at, user.username FROM post INNER JOIN user ON post.user_id = user.id  WHERE post.id = '${postId}'`,
        (err, result) => {
          if (err) {
            console.log('Error Fetching data')
            return res.status(400).send()
          }
          res.status(200).json(result)
        }
      )
    } catch (error) {
      console.error(error)
      return res.status(500).send()
    }
  })

  //? Get comments
  router.get('/comments/:postId', async (req, res) => {
    try {
      postId = req.params.postId
      connection.query(
        `SELECT c.content, c.created_at ,user.username FROM comment c
        INNER JOIN user  ON c.user_id = user.id 
        WHERE post_id ='${postId}'
        ORDER BY created_at
        `,
        (err, result) => {
          if (err) {
            console.log('Error Fetching data')
            return res.status(400).send()
          }
          res.status(200).json(result)
        }
      )
    } catch (error) {
      console.error(error)
      return res.status(500).send()
    }
  })

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

        res.status(200).json(results)
      }
    )
  })

  return router
}
