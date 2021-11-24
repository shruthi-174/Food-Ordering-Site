const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      passport              =  require("passport"),
      bodyParser            =  require("body-parser"),
      LocalStrategy         =  require("passport-local"),
      passportLocalMongoose =  require("passport-local-mongoose"),
      path                  = require("path"),
      port                  = 80,
      User                  =  require("./models/registration");
    

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/food', function(err, db) {
    if(!err) {
      console.log("We are connected");
    }
  });


//DEFINE MONGOOSE SCHEMA
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    description: String

  });

const Contact = mongoose.model('Contact', contactSchema);

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded())

app.use(require("express-session")({
    secret:"Any normal Word",       //decode or encode session
    resave: false,          
    saveUninitialized:false    
}));
passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));

app.use(bodyParser.urlencoded({ extended:true }))
app.use(passport.initialize());
app.use(passport.session());

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory
 
// ENDPOINTS
app.get('/', (req, res)=>{
    const params = {}
    res.status(200).render('home.pug', params);
})
app.get('/new', (req, res)=>{
    const params = {}
    res.status(200).render('new.pug', params);
})
app.get('/offer', (req, res)=>{
    const params = {}
    res.status(200).render('offer.pug', params);
})
app.get('/contact', (req, res)=>{
    const params = {}
    res.status(200).render('contact.pug', params);
})
app.post('/contact', (req, res)=>{
    var myData = new Contact(req.body);
    myData.save().then(()=>{
    res.send("Your feedback has been saved");
    }).catch(()=>{
    res.status(400).send("item was not saved to the databse");
});
})

app.get('/login', (req, res)=>{
    const params = {}
    res.status(200).render('login.pug', params);
})
app.post("/login",passport.authenticate("local",{
    successRedirect:"CONGRATULATIONS !!! YOU HAVE LOGGED IN SUCCESSFULLY",
    failureRedirect:"/login"
}),function (req, res){
    console.log("login");
});

app.get('/registration', (req, res)=>{
    const params = {}
    res.status(200).render('registration.pug', params);
})

app.post("/registration",(req,res)=>{
    
    User.register(new User({username: req.body.username,name:req.body.name,gender: req.body.gender,age: req.body.age}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("registration");
        }
        var myData = new User(req.body);
        //myData.save();
        console.log(myData);
        passport.authenticate("local")(req,res,function(){
        res.redirect("login");
    })    
    })
});

// START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
})
