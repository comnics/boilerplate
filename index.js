const express = require('express')
const app = express()
const port = 5000

const { User } = require('./models/User')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {
    console.log(req.body)
    const user = new User(req.body)
    user.save((err, doc) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
