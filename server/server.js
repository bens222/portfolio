const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Twilio requirements
require('dotenv').load();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('views', './views');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/projects', (req, res) => {
    res.render('projects');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/thanks', (req, res) => {
    client.messages
        .create({
            body: `${req.body.firstName} ${req.body.lastName} is requesting to contact you with this email: ${req.body.email} and they included this message: ${req.body.message}`,
            from: '+17606597150',
            to: process.env.MY_PHONE_NUMBER
        })
    .then(message => console.log(message.sid))
    .done();
    res.render('thanks', { contact: req.body })
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
});