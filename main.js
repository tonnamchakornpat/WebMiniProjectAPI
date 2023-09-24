require('dotenv').config()

const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const session = require('express-session')
const bodyParser = require('body-parser')

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

connection.connect((err) => {
  if (err) {
    console.error('error connecting DB: ' + err.stack)
    return
  }
  console.log('connected DB')
})

const getRoutes = require('./routes/getItems')(connection)
const addItemRoutes = require('./routes/addItems')(connection)
const delItemRoutes = require('./routes/delItems')(connection)
const updateItemRoutes = require('./routes/updateItems')(connection)
const userItemRoutes = require('./routes/userItems')(connection)

app.use('/get', getRoutes)
app.use('/create', addItemRoutes)
app.use('/delete', delItemRoutes)
app.use('/update', updateItemRoutes)
app.use('/user', userItemRoutes)

app.listen(process.env.APP_PORT, () => console.log('Server is running'))
