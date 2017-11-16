var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();
    
mongoose.connect('mongodb://localhost/blog_app', { useMongoClient: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// title    
// image
// body
// created
var blogModel = mongoose.model("blog", {
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

// var blogArray = [{
//     title: "Trocadero, Paris, France",
//     image: "https://images.unsplash.com/photo-1485199433301-8b7102e86995?auto=format&fit=crop&w=1080&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
//     body: "It is my favourite place in Paris and when I stay in Italy during my usually life I dream to be there in front of my favourite monument: the eiffel tower!I taken 2 bus and one metro and at 5:10 I was arrived in this wonderful place. Was very cold, but I dont stayed only!"
// }, {
//     title: "Limassol, Cyprus",
//     image: "https://images.unsplash.com/photo-1504185945330-7a3ca1380535?auto=format&fit=crop&w=1221&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
//     body: "Making your own buns, always results in a better burger. Perfection takes time, practice and hard work, but at the end it always pays off. In this case, the time was the work invested into the making of the burger and the pay off was this luscious burger."
// }, {
//     title: "Corno Nero, Italy",
//     image: "https://images.unsplash.com/photo-1437422061949-f6efbde0a471?auto=format&fit=crop&w=1050&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
//     body: "No description provided but the beautiful picture"
// }];

// blogModel.create(blogArray, function(err) {
//     if(err) {
//         console.log(err);
//     } else {
//         for(var i = 1; i < arguments.length; i++) {
//             var blog = arguments[i];
//             console.log(blog);
//         }
//     }
// })

// RESTful routes
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

// 1. index
app.get("/blogs", function(req, res) {
    blogModel.find({}, function(err, blogs) {
        if(err) {
            console.log("Error!");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started!");
});
