const { User } = require('./models')
const express = require('express')
const app = express()
const port = 3000
const SRCRET = "SLJMM;LDSF"  //模拟秘钥
const jwt = require('jsonwebtoken') //生成token
app.listen(port, () => console.log(` app listening on port 3000!`))
app.use(express.json())

app.get('/api/users', async (req, res) => {
  const users = await User.find()
  res.send(users)
})

app.post('/api/register', async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  })
  res.send(user)
})


app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  })

  if (!user) {
    return res.status(422).send({
      message: "用户名不存在"
    })
  }

  const isPwdValid = require('bcrypt').compareSync(req.body.password, user.password)
  if (!isPwdValid) {
    return res.status(422).send({
      message: "密码不正确"
    })
  }
  //生成token

  const token = jwt.sign({
    id: String(user._id)
  }, SRCRET)
  res.send({
    user,
    token
  })
})

//中间件,使得可以共用，不用每个接口都写一个token验证
const auth = async (req, res, next) => {
  const law = String(req.headers.authorization).split(" ").pop()
  const { id } = jwt.verify(law, SRCRET)//拿出存进token里面的id
  req.user = await User.findById(id)
  next()
}


app.get('/api/profile', auth, async (req, res) => {
  res.send(req.user)
})

