import Cart from "../models/cartModel.js"
import Product from "../models/productModel.js";

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Assuming the user is authenticated and the user ID is in the request

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
     
        // Ensure the price is a valid number
        const productPrice = Number(product.price);
        if (isNaN(productPrice)) {
            return res.status(400).json({ message: "Invalid product price" });
        }

        // Check if the user already has a cart
        let cart = await Cart.findOne({ user: userId });

        // If the cart doesn't exist, create a new one
        if (!cart) {
            cart = new Cart({
                user: userId,
                products: [{ productId, quantity }],
            });
            await cart.save();
            return res.status(201).json(cart);
        }

        // If the cart exists, check if the product is already in the cart
        const productIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId.toString()
        );

        if (productIndex > -1) {
            // If the product is already in the cart, update the quantity
            cart.products[productIndex].quantity += quantity;
        } else {
            // If the product is not in the cart, add it
            cart.products.push({ productId, quantity });
        }

        // Recalculate the total amount of the cart dynamically
        let totalAmount = 0;
        for (let item of cart.products) {
            const product = await Product.findById(item.productId);
            const productPrice = Number(product.price);
            if (isNaN(productPrice)) {
                throw new Error("Invalid product price");
            }
            totalAmount += productPrice * item.quantity;
        }

        cart.totalAmount = totalAmount;
        await cart.save();
        return res.status(200).json(cart);
    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

  // Remove Product from Cart
// Remove Product from Cart
export const removeFromCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id; // Assuming the user is authenticated and the user ID is in the request
    console.log(productId, userId);
    try {
        // Find the cart for the user
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the product in the cart
        const productIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId.toString()
        );

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not in cart" });
        }

        // Remove the product from the cart
        cart.products.splice(productIndex, 1);

        // Fetch the updated product details for all remaining products in the cart
        const productPromises = cart.products.map((item) => {
            return Product.findById(item.productId).then((product) => {
                const productPrice = Number(product.price);
                if (isNaN(productPrice)) {
                    throw new Error("Invalid product price");
                }
                return productPrice * item.quantity;
            });
        });

        // Wait for all product price calculations to finish
        const productPrices = await Promise.all(productPromises);

        // Calculate the totalAmount by summing up all the product prices
        const totalAmount = productPrices.reduce((total, price) => total + price, 0);

        // Update the totalAmount of the cart
        cart.totalAmount = totalAmount;

        // Save the updated cart
        await cart.save();

        return res.status(200).json(cart);
    } catch (error) {
        console.error("Error removing from cart:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

  // Get User Cart


  export const getCart = async (req, res) => {
    const userId = req.user.id; // Assuming the user is authenticated
  
    try {
      // Find the cart and populate the productId field with the necessary product details
      const cart = await Cart.findOne({ user: userId })
        .populate('products.productId', 'name price description image'); // Add more fields if needed
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Calculate totalAmount and construct the product details array
      let totalAmount = 0;
      const detailedProducts = cart.products.map((item) => {
        const product = item.productId; // Populated product details
        if (!product) return null;
  
        const productPrice = Number(product.price);
        if (isNaN(productPrice)) {
          throw new Error("Invalid product price");
        }
  
        totalAmount += productPrice * item.quantity;
  
        // Return detailed product with all relevant information
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image,
          quantity: item.quantity,
        };
      }).filter((item) => item !== null); // Filter out null values if any
  
      // Update the totalAmount of the cart
      cart.totalAmount = totalAmount;
      await cart.save(); // Save the updated cart with totalAmount
   // Return the detailed products along with the cart information
      return res.status(200).json({
        cartId: cart._id,
        totalAmount: cart.totalAmount,
        products: detailedProducts, 
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // Update Product Quantity in Cart
export const updateQuantityInCart = async (req, res) => {
    
    const {id:productId}=req.params;
    const {  quantity } = req.body;
    const userId = req.user.id; // Assuming the user is authenticated and the user ID is in the request
    
    try {
      // Ensure the quantity is a valid number
      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({success:false, message: "Invalid quantity" });
      }
  
      // Find the cart for the user
      const cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({success:false, message: "Cart not found" });
      }
  
      // Find the product in the cart
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );
  
      if (productIndex === -1) {
        return res.status(404).json({success:false, message: "Product not in cart" });
      }
  
      // Update the quantity of the product
      cart.products[productIndex].quantity = quantity;
  
      // Recalculate the total amount of the cart dynamically
      let totalAmount = 0;
      for (let item of cart.products) {
        const product = await Product.findById(item.productId);
        const productPrice = Number(product.price);
        if (isNaN(productPrice)) {
          throw new Error("Invalid product price");
        }
        totalAmount += productPrice * item.quantity;
      }
  
      cart.totalAmount = totalAmount;
      await cart.save();
      return res.status(200).json(cart);
    } catch (error) {
      console.error("Error updating product quantity:", error);
      return res.status(500).json({ message: error });
    }
  };
  
  
  
  