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
//     title: "South Salt Lake, United States",
//     image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1950&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
//     body: "This home is geothermal, super efficient, and modern. It is also available to book on Airbnb in the Salt Lake City area."
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

// 2. new
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// 3. create
app.post("/blogs", function(req, res) {
    // create new blog
    blogModel.create(req.body.blog, function(err, newBlog) {
        if(err) {
            console.log("Jedi");
        } else {
            res.redirect("/blogs");
        }
    });
});

// 4. show
app.get("/blogs/:id", function(req, res) {
    blogModel.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            console.log("Templater");
        } else {
            res.render("show", {
                blog: foundBlog
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started!");
});
