import mongoose from 'mongoose'
import {Logger} from 'borgen'
import dotenv from 'dotenv'

dotenv.config()


const ConnectDb = (startServer)=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        Logger.info({
            message:"Connected to Db...",
            messageColor:"gray"
        })
        startServer()
})
    .catch((err)=>{
        console.log(err)
        Logger.info({
            message:"ConnectDb" + err.message,
            messageColor:"red"
        })
    })
}


export default ConnectDb