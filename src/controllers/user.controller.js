
import connection from '../config/db.js'
import bcrypt from 'bcryptjs'
import jwtUtils from '../utils/jwtUtils.js'

class UserController {

  async getAll(req, res){
    try {
      const [rows] = await connection.promise().execute('SELECT * FROM users')
      res.status(200).json(rows)
    }catch (err){
      res.json({ error: err.message })
    }
  }

  async create(req, res) {
    const { name, email } = req.body 
    const password = await bcrypt.hash(req.body.password,10)

    // console.log(hashPass)

    const query = 'INSERT INTO users (name, email, password) VALUES (?,?,?)'
    try {
      const [rows] = await connection.promise().execute(query, [name, email, password])
      
      const user = {id: rows.insertId, name, email}
      const token = jwtUtils.generateToken(user)

      user.token = token
       
      res.status(200).json(user)

      if(rows.affectedRows === 0) {
        throw new Error('No se encontro ningun registro que coincida')
      }

    } catch(error){
      console.error('Error execute:', error); 
      console.error('Mensaje del error:', error.message); 
      return res.status(500).json({ message: 'Error en la consulta', error: error.message });
    }
  }

  async profile(req, res){
    const { name, email } = req.user
    res.status(200).json({
      name,
      email
    })
    
  }

}

export default new UserController()