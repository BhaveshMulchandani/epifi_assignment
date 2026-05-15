const express =  require('express')
const app = express()
const cookieParser = require('cookie-parser')


app.get('/',(req,res)=>{
    res.send('Welcome to the notes app')
})


app.use(express.json())
app.use(cookieParser())

module.exports = app