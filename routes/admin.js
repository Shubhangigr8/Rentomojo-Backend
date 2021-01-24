const express = require('express')
const router = express.Router()
const Admin = require('../models/admin')
const { hashSync, genSaltSync, compareSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

router.post('/signup', async(req,res) =>{
    console.log("adin signup")
    const salt = genSaltSync(10);
    password = hashSync(req.body.password, salt);
    const admin = new Admin({
        email: req.body.email,
        password: password,
    })  
    try {
        const newAdmin = await admin.save()
        res.status(201).json(newAdmin)
    } catch(err) {
        res.status(400).json({message: err.message})
    }
    
})

router.post('/login', async(req,res)=> {
    const users = await Admin.find({
        "$or": [{
          "email": (req.body.email).toLowerCase()
        }]
    })
    // error
    if(users.length <= 0) {
        res.status(400).json({
            success: false,
            message: "Incorrect email or password"
        })
    } else {
        const isPasswordCorrect = compareSync(req.body.password, users[0].password);
        if(isPasswordCorrect) {
            const jsonWebToken = sign({ user: req.body.email }, process.env.JWT_KEY, {
                expiresIn: "1000h"
            });
            res.status(200).json({
                success: true,
                token: jsonWebToken
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }
    }
    
})

module.exports = router;