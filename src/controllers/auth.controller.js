import jwtUtils from '../utils/jwtUtils.js'
import connection from '../config/db.js'
import bcrypt from 'bcryptjs'


class AuthController {

  
  async login(req, res) {
    const { email, password } = req.body

    try {
      const [users] = await connection.promise().execute('SELECT * FROM users WHERE email = ?',[email])
    

      if(users.length === 0){
        return res.status(400).json({ message: 'User not found'})
      }
     
      const user = users[0]

      const match = await bcrypt.compare(password, user.password)

      if(!match){
        return res.status(401).json({ message: 'Wrong password'})
      }

      const token = jwtUtils.generateToken({
        id: user.id,
        email: user.email,
        name: user.name
      })

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        maxAge: 2 * 60 * 1000
      }

      res.cookie('token', token, cookieOptions)
      
      
      res.status(200).json({
        message: 'Login success',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })

    }catch(err){
      res.status(500).json({error: err.message})
    }
  }
}

export default new AuthController();