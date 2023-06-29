const sgMail = require('@sendgrid/mail')

const sendGridAPIKey = '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'

sgMail.setApiKey(sendGridAPIKey)

// sgMail.send({
//     to:'ayushigrover001@gmail.com',
//     from: 'ayushigrover001@gmail.com',
//     subject: 'This is my first creation',
//     text:'Ihope this one gets to you'
// })

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'ayushigrover001@gmail.com',
        subject: 'Thanks for registering here.',
        text:'Ihope this one gets to you'
    })
}

module.exports = {
    sendWelcomeEmail 
}