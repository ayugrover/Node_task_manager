const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type: String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(val){
            if(!validator.isEmail(val))
            {
                throw new Error('Email is invalid');
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(val){
            if(val.toLowerCase().includes('password'))
                throw new Error('Password short')
        }
    },
    age:{
        type:Number,
        default:0,
    },
    tokens:[{
        token:{
            type: String,
            required:true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps: true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.getPublicProfile = function(){
    const userObj = this.toObject()

    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar
    
    return userObj
}

userSchema.methods.generateAuthToken = async function(){
    //const user = this
    const token = jwt.sign({_id: this._id.toString()},'thisisnewcourse')
    this.tokens = this.tokens.concat({token})
    this.save()
    
    return token
}

userSchema.statics.findByCredentials = async(email, password) =>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) throw new Error('Invalid Password !!')

    return user
}

userSchema.pre('save',async function(next){
    const user = this
    
    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password,8)
    }

    console.log('just before saving!!')
    next()
})

userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({
        owner: user._id
    })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User;