const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/express-auth', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: {
    type: String,
    set(val) {
      return require('bcrypt').hashSync(val,10)//npm i bcrypt  加密
    }
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = { User }