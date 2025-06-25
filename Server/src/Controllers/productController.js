import { StatusCodes } from "http-status-codes";
import Product from "../Models/product.model.js";
import imagekit from "../Util/imageKit.js";
import { Logger } from "borgen";


//@desc  Create new product 
//@route POST /api/v1/product/create
export const createProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const image = req.file;

    if (!name || !price || !category || !description || !image) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "erorr",
        message: "Please fill all the required product fields",
        data: null,
      });
    }

    //upload image to imagekit 
    const uploadResponse = await imagekit.upload({
      file: image.buffer,
      fileName: `product-${Date.now()}`,
      folder: "/product",
    });

    //new product saved
    const newProduct = await Product.create({
      name,
      price,
      description,
      category,
      imageUrl: uploadResponse.url,
      imageFileId: uploadResponse.fileId
    });

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Product was created successfully",
      data: newProduct,
    });
  } catch (error) {
    Logger.error({ message: error.message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while creating a product",
      data: null,
    });
  }
};

//@desc Get one product byId  
//@route GET /api/v1/product/one/:id

export const getOneProduct = async(req,res)=>{
  try {
    const productId = req.params.id

    const product = await Product.findById(productId)
    
    if(!product){
      return res.status(StatusCodes.BAD_GATEWAY).json({
        status:'error',
        message:'Product not found',
        data:null
      })
    }

    return res.status(StatusCodes.OK).json({
      status:'success',
      message:'Product fetched successfully',
      data: product
    })
  } catch (error) {
    Logger.error({message: error.message})

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status:'error',
      message:'An error occured while fetching a product',
      data:null
    })
  }
}



//@desc Get all product
//@route GET /api/v1/product/all

export const getAllProducts = async(req,res)=>{
  try {
    const products = await Product.find()

    return res.status(StatusCodes.OK).json({
      status:'success',
      message:'Products fetched successfully',
      data: products
    })
  } catch (error) {
    Logger.error({message: error.message})

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status:'error',
      message:'An error occured while fetching all products',
      data:null
    })
  }
}



//@desc Update product byId 
//@route PUT /api/v1/product/update/:id

export const updateProduct= async (req,res)=>{
  try {
    const productId = req.params.id
    const {name, price, description,category} = req.body
    const image = req.file

    if(!name||!price||!description||!category){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status:'error',
        message:'Please fill all the required fields',
        data:null
      })
    }

    const product = await Product.findById(productId)
    if(!product){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status:'error',
        message:'The product was not found',
        data:null

      })
    }

     if(name) product.name = name
     if(price)product.price = price
     if(description)product.description = price
     if(category)product.category = category
       

     //update the image in imagekit and url in database
     if(image){

      if(product.imageFileId){
        await imagekit.deleteFile(product.imageFileId)
      }

      const uploadResponse = await imagekit.upload({
        file: image.buffer,
        fileName: `product-${Date.now()}`,
        folder:"/product"

      })

      product.image= uploadResponse.url
      product.imageFileId= uploadResponse.fileId

     }

     const updatedproduct = await product.save()

     return res.status(StatusCodes.OK).json({
      status:'success',
      message:'Product was updated successfully',
      data: updatedproduct
     })



  } catch (error) {
     Logger.error({message: error.message})

     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status:'error',
      message:'An error occured while updating the product',
      data:null
     })
  }
}


//@desc Delete product byId 
//@route DELETE /api/v1/product/delete/:id

export const deleteProduct= async (req,res)=>{
  try {
    const productId = req.params.id

    const deletedProduct = await Product.findByIdAndDelete(productId)

    if(!deletedProduct){
      return res.status(StatusCodes.BAD_REQUEST).json({
        status:'error',
        message:'Product not found',
        data:null

      })
    }


    return res.status(StatusCodes.OK).json({
      status:'success',
      message:'Product was deleted successfully',
      data:{
        id: deletedProduct._id,
        name:deletedProduct.name
      }

    })


  } catch (error) {
    Logger.error({message: error.message})

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status:'error',
      message:'An error occured while deleting product',
      data:null
    })
  }
}


