require('dotenv').config()

const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const session = require('express-session')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())
app.use(
  session({
    secret: 'my secret', // คีย์ลับสำหรับเข้ารหัส session
    resave: false, // หากค่านี้เป็น false, Express จะไม่บังคับให้ session ทุกครั้งเมื่อมีการเปลี่ยนแปลงใน request
    saveUninitialized: true,
  })
)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
})

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401) // if there isn't any token

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = user
    console.log(user)
    next()
  } catch (error) {
    return res.sendStatus(403)
  }
}

connection.connect((err) => {
  if (err) {
    console.error('error connecting DB: ' + err.stack)
    return
  }
  console.log('connected DB')
})

const middleWare = [connection, authenticateToken]

const getRoutes = require('./routes/getItems')(...middleWare)
const addItemRoutes = require('./routes/addItems')(...middleWare)
const delItemRoutes = require('./routes/delItems')(...middleWare)
const updateItemRoutes = require('./routes/updateItems')(...middleWare)
const userItemRoutes = require('./routes/userItems')(...middleWare)

app.use('/get', getRoutes)
app.use('/create', addItemRoutes)
app.use('/delete', delItemRoutes)
app.use('/update', updateItemRoutes)
app.use('/user', userItemRoutes)

app.listen(process.env.APP_PORT, () => console.log('Server is running'))
