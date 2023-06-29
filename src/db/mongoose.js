const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser : true,
   // useCreateIndex: true
})

// const description = mongoose.model('Details',{
//     phone:{type: String},
//     emailid:{
//         type: String,
//         validate(val){
//             if(!validator.isEmail(val))
//             {
//                 throw new Error('Email is invalid');
//             }
//         }
//     },
//     password:{
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 7,
//         validate(val){
//             if(val.toLowerCase().includes('Password'))
//                 throw new Error('Password short')
//         }
//     },
//     completed:{type: Boolean}
// })

// const details = new description({
//     phone:'9896898945',
//     emailid:'abcd@gmail.com',
//     completed:true
// })

//details.save().then(res=>console.log(res)).catch(error=>console.log(error))