import {model,Schema} from 'mongoose'



const ProductSchema= new Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        
    },
    description:{
        type: String
    },
    category:{
        type: String,
        enum:['Fashion','Electronics','Home & Living',    'Health & Beauty','Groceries','Kids & Baby','Entertainment','Sports & Outdoors','Tools & DIY','Automotive']
    },
    imageUrl:{
        type: String,
        required: true
    },
    imageFileId:{
        type: String,
    },
},
{timestamps:  true}
)



const Product= model('Product', ProductSchema)

export default Product