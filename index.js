const express = require("express");
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const User = require('./user')
const app = express();
const path = require('path');
// const multer = require('multer');
const bcrypt = require('bcryptjs');
const storage = require('./cloudinary');
const cloudinary = require('cloudinary');
// const upload = multer({storage});
require('dotenv').config();

const PORT = process.env.PORT || 8080;

//mongodb connection

mongoose.connect('mongodb://localhost:27017/PashuDhan', { useNewUrlParser: true })
    .then(() => {
        console.log("Mongo Connection Open!!!")
    })
    .catch(err => {
        console.log("mongo connection error!");
        console.log(err);
    })


//mapbox geocodings

const mapbox = require('@mapbox/mapbox-sdk/services/geocoding')
const mapbox_token = process.env.MapToken;
const geocoder = mapbox({ accessToken: mapbox_token });

// Google Authentication 
const { OAuth2Client } = require('google-auth-library');
const res = require("express/lib/response");
const { Hash } = require("crypto");
const CLIENT_ID = '396918042087-9ejg6k7n4i7etgc50jv1lap0oergma7a.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));
app.use(cookieParser());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })  
  );
app.set('views', path.join(__dirname, '/views'));

app.use("/assets", express.static('assets'));

app.get('/', (req, res) => {
    res.render('home.ejs');
})
app.get('/home', (req, res) => {
    console.log(mapbox_token);


    res.render('home.ejs');
})
app.get('/login', (req, res) => {
    res.render('home.ejs');
})
app.get('/uploadpet', (req, res) => {
    res.render('uploadpet.ejs');
})

app.post('/upload', async(req, res) =>{
       
        let imagearr = [];
        // console.log(req.files);
        if(req.files){
            for( let index = 0;index<req.files.petimage.length;index++){
                let result = await cloudinary.v2.uploader.upload(
                    req.files.petimage[index].tempFilePath,
                    {
                        folder: "pets",
                    }

                )
                console.log(result);
            }
            
        }
        
        res.redirect('/dashboard');
});

app.post('/register', async(req, res) => {
    const { password, phone } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        password: hash,
        phone
    })
    await user.save();
    res.redirect('/login');
})

app.post('/login', async(req, res) => {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone: req.body.phone });
    const validpassword = await bcrypt.compare(password, user.password);
    if (validpassword) {
        res.render('dashboard')

    } else {
        res.send("Wrong Credentials!")
    }
})

app.post('/glogin', (req, res) => {
    let token = req.body.token;


    console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload);

    }
    verify()
        .then(() => {
            res.cookie('session-token', token);
            res.send('Success');
        }).
        catch(console.error);
})

app.get('/dashboard', checkAuthenticated, (req, res) => {
    let user = req.user;
    res.render('dashboard.ejs', { user });
})

//geocoding



function checkAuthenticated(req, res, next) {

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    }
    verify()
        .then(() => {
            req.user = user;
            next();
        })
        .catch(err => {
            res.redirect('/login')
        })

}
app.get('/logout', (req, res) => {
    res.clearCookie('session-token');
    res.redirect('/home');
})


app.get('*', (req, res) => {
    res.send("We can't find the page you are looking for!");
})
app.listen(PORT, () => {
    console.log("listening on port 1010");
})