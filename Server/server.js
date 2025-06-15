import express from 'express'
import ConnectDb from './connect.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT


//Middlewares

app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Hello there')
})

//Routes




//Start server to connect to database
const startServer = ()=>{
app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`)
})
}


ConnectDb(startServer)

