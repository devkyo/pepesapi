import connection from '../config/db.js'
import fs from 'fs-extra'
import prisma from '../utils/prisma.js'
import { productSchema,  productUpdateSchema } from '../utils/validator.js'

class ProductController {

  async getAll(req, res) {
    try {
     const products = await prisma.product.findMany()
     res.status(200).json(products)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
  
  async create (req, res) {

    const { name, price, quanty } = req.body
    const imagePath = `uploads/${req.file.filename}`

    const {error, value} = await productSchema.validate(
      {
        name,
        price: parseFloat(price),
        quanty: parseInt(quanty),
        image: imagePath
      }
    )

    try {
      if(!error) {
        res.status(500).json(error.message)
      }
      const product = await prisma.product.create({
        data: {...value, image: imagePath}
   
      })
      res.status(200).json(product)
    } catch(err) {
      res.status(500).json({ message: err.message })
    }

    
  }
  
  async get(req, res){
    const { id } = req.params
    
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: parseInt(id)
        }
      })
      
        res.status(200).json(product)
      
    } catch(err){
      res.status(500).json({message: err.message})
    
    }
  }
  
  async update(req, res){
    const { id } = req.params
    const { name, price, quanty } = req.body

    if (req.file) {
      // Aquí podrías agregar validaciones personalizadas para el archivo si lo necesitas
      const validMimeTypes = ['image/jpeg', 'image/png'];
  
      if (!validMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Invalid file type' });
      }
    }
   
    const exists = await prisma.product.findUnique({
      where: {
        id: parseInt(id)
      }
    })
    if(!exists)  return res.status(404).json({message: 'Product not exists'})
      
    
    const {error ,value } = await productUpdateSchema.validate(
      
      {
        name:  name || exists.name,
        price:  price || exists.name,
        quanty: quanty || exists.quanty,
        image: req.file ? `uploads/${req.file.filename}` : exists.image
      },
      { abortEarly: false }
    )
  
    if (error) {
      return res.status(400).json({ errors: error.message});
    }
    
    const updatedProduct = {
      name: name || exists.name,
      price: parseFloat(price) || exists.price,
      quanty: parseInt(quanty) || exists.quanty,
      image: req.file ? `uploads/${req.file.filename}` : exists.image
    }
    
    try {
        const product = await prisma.product.update({
          where: {id: parseInt(id)},
          data: updatedProduct
        })
        res.status(200).json(product)

    } catch(err){
      res.status(500).json({message: err.message})
    }
  }
  
  async delete(req, res){
    const { id } = req.params
    if (!id ) {
      return res.status(400).json({ message: 'El id es requerido' });
    }
  
    // busqueda de imagen 
    const query = 'SELECT * FROM products WHERE id = ?'
    const [rows] = await connection.promise().execute(query, [id])
  
    if(rows.length===0){
      console.log(rows.length)
      res.status(404).json({message:'No se encontro el producto.'})
      return
    }
  
    try {
      // // Remove imagen path in database
      await fs.remove(rows[0].image)
  
  
      // // delete item in databae
      const queryDelete = 'DELETE FROM  products WHERE id = ?'
      await connection.promise().execute(queryDelete,[id])
  
      res.status(200).json({message: 'Producto eliminado.'})
  
    }catch(err){
      res.status(500).json({message: err.message})
    }
  }

}

export default new ProductController()
