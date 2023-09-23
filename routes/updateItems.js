const express = require('express')
const router = express.Router()

module.exports = (connection) => {
  //? Update Title and Content of a Post
  router.put('/post/:postId', async (req, res) => {
    try {
      const postId = req.params.postId
      const { title, content } = req.body

      connection.query(
        `UPDATE post SET title = '${title}', content = '${content}' WHERE id = '${postId}'`,
        (err, result) => {
          if (err) {
            console.log('Error updating post:', err)
            return res.status(400).send()
          }

          if (result.affectedRows === 0) {
            console.log('Post not found')
            return res.status(404).json({ error: 'Post not found' })
          }

          console.log('Post updated successfully')
          res.status(200).json({ message: 'Post updated successfully' })
        }
      )
    } catch (error) {
      console.error(error)
      return res.status(500).send()
    }
  })

  return router
}
