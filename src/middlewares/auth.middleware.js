import jwtUtils from '../utils/jwtUtils.js'

const verifyTokenMiddleware = (req, res, next) => {
  try {
    // const token = req.headers['authorization']?.split(' ')[1]
    const token = req.cookies.token

  
    if(!token){
      return res.status(401).json({ message: 'Token not found or expired'})
    }

    const decoded = jwtUtils.verifyToken(token)
    req.user = decoded
    next()
  } catch(err){
    res.status(401).json({ message: err.message})
  }
}

export default verifyTokenMiddleware