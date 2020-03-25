const express = require('express')
const Sequelize = require('sequelize')
const cors = require('cors')

const port = 5000
const host = '0.0.0.0'
const app = express()
app.use(cors())

const database = 'oddball'
const username = 'postgres'
const password = 'postgres'

const db = new Sequelize(
  database,
  username,
  password,
  {
    host: 'database',
    dialect: 'postgres'
  }
)

db
  .authenticate()
  .then(() => {
    console.log(`Connection established successfully.`)
  })
  .catch(err => {
    console.error(`Unable to connect to the database: ${err}`)
  })

const Model = Sequelize.Model;
class User extends Model {}
User.init({
  // attributes
  firstName: {
    type: Sequelize.STRING,
    // allowNull: false
  },
  lastName: {
    type: Sequelize.STRING
    // allowNull defaults to true
  }
}, {
  sequelize: db,
  modelName: 'user'
});

User.sync({ force: true })
  .then(() => {
    return User.create({
      firstName: 'Ben',
      lastName: 'Poon'
    })
  })
  .then(() => {
    return User.create({
      firstName: 'Sarah',
      lastName: 'Chen'
    })
  })


app.get('/', (req, res) => {
  res.send('hello, world!')
})

app.get('/api/users', (req, res) => {
  User
    .findAll()
    .then(users => users.json())
    .then(data => res.send(data))
})




app.listen(port, host, () => console.log(`Example app listening on port ${port}!`))
