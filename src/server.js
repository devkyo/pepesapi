import express from 'express'
import 'dotenv/config'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/error.middleware.js'
import cookieParser  from 'cookie-parser'

const PORT = process.env.PORT || 5000;
const app = express()


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler)
app.use(cookieParser());

// routes
app.use('/api', routes)

app.use( (err, req, res, next) => {
  res.status(err.status || 500).json( { error: err.message})
})


app.listen(PORT, ()=> console.log(`Server on port: ${PORT}`))