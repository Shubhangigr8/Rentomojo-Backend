const express = require('express')
const router = express.Router()
const Contact = require('../models/contact')


router.get('/', async(req,res)=> {
    try {
        let pageLimit = req.query.limit || 10;
        let page = req.query.page || 1;
        const contacts = await Contact.paginate({}, {pageLimit, page})
        res.send(contacts)
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})
router.get('/search', async(req,res)=> {
    try {
        let pageLimit = req.query.limit || 10;
        let page = req.query.page || 1;
        let name = req.body.name;
        let email = req.body.email;
        let contacts;
        if(name !== undefined && name != "") {
            console.log("in name")
            contacts = await Contact.paginate(
                {name: {$regex: '.*' + name + '.*' }
            }, 
            {pageLimit, page})
        } else if(email !== undefined && email != "") {
            console.log("in email")
            contacts = await Contact.paginate(
                {email: {$regex: '.*' + email + '.*' },
            }, 
            {pageLimit, page})
        } 
        else {
            console.log("in email and contact")
            contacts = await Contact.paginate({
                name: {$regex: '.*' + name + '.*' },
                email: {$regex: '.*' + email + '.*' },
            }, 
            {pageLimit, page})
        }

        res.send(contacts)
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})
router.post('/', async(req,res)=> {
    const contact = new Contact({
        name : req.body.name,
        phone : req.body.phone,
        email : req.body.email,
    })
    try {
        const newContact = await contact.save();
        res.status(201).json(newContact)
    } catch(err) {
        res.status(400).json({
            success: false,
            message: "Email address already exists"
        })
    }
})
router.patch('/:id', getContact, async(req,res)=> {
    console.log(res.contact)
    res.contact.name = req.body.name
    res.contact.phone = req.body.phone
    res.contact.email = req.body.email
    try {
        const newContact = await res.contact.save();
        res.status(201).json(newContact)
    } catch(err) {
        console.log(err)
        res.status(400).json({
            success: false,
            message: "Something went wrong"
        })
    }
})

router.delete('/:id', getContact, async (req,res) =>{
  
    try{
        await res.contact.remove()
        res.json({
            success: true,
            message : "Deleted contact"
        })
    } catch(err) {
        res.status(500).json({ 
            success: true,
            message: "Something went wrong"
        })
    }
})


async function getContact(req, res, next) {
    let contact;
    try
    {
        contact = await Contact.findById(req.params.id)
        if(contact == null)
        {
            return  res.status(404).json({message:"cannot find data"})
        }
    } catch(err) {
        return res.status(500).json({message: err.message})
    }
    res.contact = contact
    next()
}

module.exports = router;