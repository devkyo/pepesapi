import Joi from 'joi'

export const productSchema = Joi.object({
  name: Joi.string().min(3).required(),
  price: Joi.number().integer().required(),
  quanty: Joi.number().precision(2).greater(0).required(),
  
})

export const productUpdateSchema = Joi.object({
  name: Joi.string().min(3),
  price: Joi.number().precision(2).positive(),
  quanty: Joi.number().precision(2).positive(),
  image: Joi.string()
}).min(1)

// export { productSchema, productUpdateSchema }