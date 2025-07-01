import User from "../Models/user.model.js";
import Product from "../Models/product.model.js";
import { StatusCodes } from "http-status-codes";
import { Logger } from "borgen";
import { mongoose } from "mongoose";

//@desc Add a product to cart
//@route POST /api/v1/cart/add

export const addProductToCart = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const { quantity, productId } = req.body;

    if (!productId || !quantity) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Provide all the required fields",
        data: null,
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "Product not found",
        data: null,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "You are not allowed to perform this function",
        data: null,
      });
    }

    //Check if product is enough in stock
    if (product.quantity < quantity) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: `Insufficient stock.Only ${product.quantity} items available`,
        data: null,
      });
    }

    //Check if product exists already in cart
    const existingProduct = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      user.cart.push({
        product: productId,
        quantity,
      });
    }

    await user.save();

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Product added to cart successfully",
      data: {
        cart: user.cart,
      },
    });
  } catch (error) {
    Logger.error({ message: error.message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while trying to add product to cart",
      data: null,
    });
  }
};

//@desc Update cart product quantity
//@route PUT  /api/v1/cart/update
export const updateCartItem = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Provide all the fields",
        data: null,
      });
    }

    const user = await User.findById(userId);
    const item = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "Product not found in cart",
        data: null,
      });
    }

    if (quantity <= 0) {
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    return res.status(StatusCodes.OK).json({
      status: "error",
      message: "Product in cart updated successfully",
      data: user.cart,
    });
  } catch (error) {
    Logger.error({ message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while trying to update  cart item",
      data: null,
    });
  }
};

//@desc Fetch all items in cart
//@route GET /api/v1/cart/all
export const getAllItemsCart = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const user = await User.findById(userId).populate([
      {
        path: "cart.product",
        select: "id name image description price",
      },
    ]);

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Items fetched successfully",
      data: user.cart,
    });
  } catch (error) {
    Logger.error({ message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while trying to fetch items from cart",
      data: null,
    });
  }
};

//@desc Remove a product from cart
//@route DELETE /api/v1/cart/remove/:productId

export const removeItemCart = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const productId = req.params.userId;

    const user = await User.findById(userId);
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Item removed from cart successfully.",
      cart: user.cart,
    });
  } catch (error) {
    Logger.error({ message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while trying to remove item from cart",
      data: null,
    });
  }
};

//@desc  Clear user's cart
//@route DELETE /api/v1/cart/clear
export const clearCart = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "User not found.",
        data: null,
      });
    }

    user.cart = [];

    await user.save();

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Cart cleared successfully",
      data: null,
    });
  } catch (error) {
    Logger.error({ message });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occured while trying to clear cart",
      data: null,
    });
  }
};

//@desc checkout order in cart
//@route POST /api/v1/cart/checkout
export const checkout = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const user = await User.findById(userId).populate('cart.product');

    if (!user || user.cart.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Cart is empty or user not found.',
      });
    }

    // Only calculate cost here, no clearing of cart yet
    const totalCost = user.cart.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Checkout data ready.',
      data: {
        totalCost,
        products: user.cart.map(item => ({
          id: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        }))
      }
    });
  } catch (err) {
    Logger.error({ message: err.message });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Error during checkout',
    });
  }
};
