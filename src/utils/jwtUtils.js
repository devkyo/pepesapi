import jwt from 'jsonwebtoken'


class jwtUtils{

  generateToken(user){
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email
    }
    const options = {
      expiresIn: process.env.JWT_EXPIRES
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, options)
    return token
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET)
      
    } catch(err) {
      throw new Error('Token is not valid or expired')
    }
  }
}

export default new jwtUtils()