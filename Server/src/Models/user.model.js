import {model,Schema} from 'mongoose'


 const UserSchema = new Schema({
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
    cart:[{
        product:{type: Schema.Types.ObjectId, ref: 'Product'},
        quantity:{ type:Number, required:true},
    }]
},
{timestamps:true}
)


const User =model('User', UserSchema)

export default User