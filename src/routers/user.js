const express = require('express');
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail} = require('../emails/account')
const router = new express.Router();

// const errorMiddleware = (req,res, next) =>{
//     throw new Error('From my middleware')
// }

const upload = multer({
    dest:'images',
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
            cb(new Error('File must not be pdf'))

         cb(undefined, true)
    },
    storage: multer.memoryStorage()
})

router.post('/user/upload',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = new sharp(req.file.buffer).resize({width: 250, height:250}).toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/user/upload',auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
     res.send()
 },(error,req,res,next)=>{
     res.status(400).send({error: error.message})
 })

router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(201).send({user:user.getPublicProfile(),token})
    }catch(e){
         res.status(400).send(e)
    }  
})

router.get('/users/logout',auth , async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter(tok => {
            return tok.token !== req.token
        })
        await req.user.save()
        res.send('logged out!!')
    }catch(e){
         res.status(500).send(e)
    }  
})

router.get('/users/logoutAll',auth , async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send('logged out all sessions!!')
    }catch(e){
         res.status(500).send(e)
    }  
})


router.post('/users',async(req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        res.send(user)
    }catch(error){
        res.status(400).send(error)
    }
   
})

router.patch('/update_user/me',auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowUpdates = ['name','email','password','age']

    const isValid = updates.every((item)=>allowUpdates.includes(item))

    if(!isValid)
         return res.status(400).send('User Not found')

    try{ 
       // const user = await User.findById(req.params.id)
        updates.forEach((update)=>req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    }catch(e){
        return res.status(400).send(e)
    }
})

router.get('/users_list/me',auth,(req,res)=>{
//     console.log(req.query)
//    let promise = User.find({});
//     promise.then(resp=>{
//         res.send(resp)
//     }).catch(error=>{res.status(500).send('Server down!!')})

    res.send(req.user)
})

router.delete('/delete_user/me', auth, async(req,res)=>{
    try{
        await req.user.remove()
        console.log('abc',req.user)
        //res.send(req.user)
    }catch(e){
        res.status(400).send('User not found!!')
    }
})

router.get('/users/:id/avatar', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        console.log(user)
        if(!user)
            res.status(400).send('User not found')

        res.set('Content-type','image/jpg')
        res.send(user.avatar)        
    }catch(e){
        res.status(500).send('User not found')
    }
})


module.exports = router