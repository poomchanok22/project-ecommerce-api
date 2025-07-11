import prisma from "../config/prisma.js";
import createError from "../utils/create-error.util.js";
import cloudinary from "../config/cloudinary.js"
import path from "path"
import fs from "fs/promises"

export async function createProducts(req, res, next) {
  const {name, description, price, stock, category_id} = req.body

  if (!name || !description || !price || !stock || !category_id) {
    createError(400, "All fields are required")
  }

  let imageUrl = ''
  
    if (req.file) {
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      overwrite: true,
      public_id: path.parse(req.file.path).name
    });

    imageUrl = uploadResult.secure_url || '';

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
  }

  const newProduct = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      image: imageUrl,
      category_id: parseInt(category_id),
      created_by: req.user.id,
    }
  });

  res.status(201).json({
    message: "Product created successfully",
    result: newProduct
  });
}

export async function editProduct(req, res, next) {
  const {product_id} = req.params
  const {name, description, price, stock, category_id} = req.body

  if(!name || !description || !price || !stock || !category_id){
    createError(400, "All fields are required")
  }

  const existingProduct = await prisma.product.findUnique({
    where: {product_id: parseInt(product_id)}
  })

  if(!existingProduct) {
    createError(400, "Product not found")
  }

  let imageUrl = existingProduct.image

  if(req.file){
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      overwrite: true,
      public_id: path.parse(req.file.path).name
    })
    imageUrl = uploadResult.secure_url || "";
    fs.unlink(req.file.path, (err) => {
      if(err) console.error("Error deleting file", err)
    })
  }

  const updateProduct = await prisma.product.update({
    where: {product_id: parseInt(product_id)},
    data: {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      image: imageUrl,
      category_id: parseInt(category_id)
    }
  })

  res.status(200).json({
    message: "Product updated successfully",
    result: updateProduct
  })
}

export async function getAllProducts(req, res, next) {
  const allProducts = await prisma.product.findMany({
    orderBy: {category_id: "asc"}
  })

  res.json({products: allProducts})
}

export async function getProductById(req, res, next) {
  const {product_id} = req.params

  const productById = await prisma.product.findUnique({
    where: {product_id: parseInt(product_id)}
  })

  if(!productById) {
    createError(400, "Product not found")
  }

  res.json({productById})
  
}

export async function deleteProduct(req, res, next) {
  const {product_id} = req.params

  const foundProduct = await prisma.product.findUnique({
    where: {product_id: parseInt(product_id)}
  })

  if(!foundProduct) {
    createError(400, "Product not found")
  }

  const deleteProductById = await prisma.product.delete({where: {product_id: parseInt(product_id)}})

  res.json({message: "Delete done"})
}