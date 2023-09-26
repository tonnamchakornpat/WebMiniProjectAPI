const express = require('express')
const router = express.Router()

module.exports = (connection, authenticateToken) => {
  router.delete('/post/:postId', authenticateToken, async (req, res) => {
    const postId = req.params.postId
    try {
      connection.query(
        `DELETE FROM post WHERE id = '${postId}'`,
        (err, result) => {
          if (err) {
            console.log('Error deleting data')
            return res.status(400).send()
          }

          if (result.affectedRows === 0) {
            console.log('Post not found')
            return res.status(404).json({ error: 'Post not found' })
          }

          console.log('Post deleted successfully')
          res.status(200).json({ message: 'Post deleted successfully' })
        }
      )
    } catch (error) {
      console.log(error)
      return res.status(500).send()
    }
  })

  return router
}
