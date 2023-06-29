const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth')
const router = new express.Router();

router.post('/create_task', auth,(req, res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    task.save().then(()=>{
        res.status(201).send(task)
    }).catch(error=>{
        res.status(400).send(error)
    })
})

router.get('/get_tasks', auth ,async(req, res)=>{
    const match = {}
    const sort = {}
    if(req.query.completed)
    {
        match.completed = req.query.completed == 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1
    }
    try{
        await req.user.populate({
            path: 'tasks', 
            match, 
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/get_task/:id', auth, (req, res)=>{
   // let promise = Task.find(req.params.id);
    let promise = Task.findOne({_id, owner: req.user._id})
    promise.then((task)=>{
        if(!task)
             res.status(404).send('Task not found!!')
        
        res.send(task)
    }).catch(error=>{
        res.status(400).send(error)
    })
})

router.patch('/update_task/:id',auth ,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowUpdates = ['name', 'completed']

    const isValid = updates.every((item)=>allowUpdates.includes(item))

    if(!isValid)
         return res.status(400).send('task Not foundddd')

    try{
        const task = await Task.findOne({_id: req.params.id, owner:req.user._id})

        if(!task)
        {
            return res.status(400).send('task Not found')
        }

        updates.forEach(update =>task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        return res.status(400).send(e)
    }
})

router.delete('/delete_task/:id',auth ,async(req,res)=>{
    try{
        const user = await Task.findOneAndDelete({_id: req.params.id, owner:req.user._id})

        if(!user)
            return res.status(400).send('User not found!!')

        res.send('Task Deleted successfully!!')
    }catch(e){
        res.status(400).send('User not found!!')
    }
})

module.exports = router;