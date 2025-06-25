import express from 'express'
import ConnectDb from './connect.js'
import dotenv from 'dotenv'
import router from './src/Routes/router.js'




dotenv.config()

const app = express()
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT


//Middlewares

app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Hello there')
})

//Routes

app.use(router)


//Start server to connect to database
const startServer = ()=>{
app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`)
})
}


ConnectDb(startServer)

