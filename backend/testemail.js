const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'deyushport@gmail.com',
        pass: 'fwvf ljqb oqia mijt'
    }
});

const mailOptions = {
    from: 'your.email@gmail.com',
    to: 'your.email@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email from nodemailer.'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.error('Error:', error);
    }
    console.log('Email sent:', info.response);
});