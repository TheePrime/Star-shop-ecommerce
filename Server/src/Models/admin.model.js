import {model,Schema} from  'mongoose'



 const AdminSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        unique:true,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    role: {
      type: String,
      enum: ["admin", "superAdmin"],
      default: "admin",
    },
 },
{timestamps:true},
)

const Admin =model('Admin' , AdminSchema)

export default Admin