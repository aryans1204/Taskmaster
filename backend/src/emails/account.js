const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.SENDER_ADDRESS,
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Please try to keep your task quotas per month below 100, as I can only afford so much
        database charges, thanks for understanding.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.SENDER_ADDRESS,
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I will be deleting all your old tasks from the database`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}