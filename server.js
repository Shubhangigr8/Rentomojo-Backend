require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const { checkToken, adminMiddleware } = require("./auth/admin");
const bodyParser = require('body-parser');

mongoose.connect(process.env.DATABASE_URL , {
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('DATABASE: OK'))

app.use(express.json())
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// admin
const adminSchema = require('./routes/admin')
app.use('/admin', adminSchema )
// check token
app.use('/checktoken', checkToken )  
// contact
const contactSchema = require('./routes/contact')
app.use('/contact', adminMiddleware, contactSchema )





app.listen(3000, () => console.log("SERVER STATUS: OK"))