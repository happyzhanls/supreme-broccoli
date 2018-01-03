var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    // ↑_Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
    expressSanitizer = require("express-sanitizer"),
    // ↑_An express middleware for Caja-HTML-Sanitizer, which wraps Google Caja sanitizer.
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();
    
var DATABASEURL = process.env.DATABASEURL || "mongodb://localhost/blog_app";
mongoose.connect(DATABASEURL, { useMongoClient: true });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

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

// 1. Index Route
app.get("/blogs", function(req, res) {
    blogModel.find({}, function(err, blogs) {
        if(err) {
            console.log("Error in the Index Route!");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// 2. New Route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// 3. Create Route
app.post("/blogs", sanitizeBlog, function(req, res) {
    // create new blog
    blogModel.create(req.body.blog, function(err, newBlog) {
        if(err) {
            console.log("Error in the Create Route");
        } else {
            res.redirect("/blogs");
        }
    });
});

// 4. Show Route
app.get("/blogs/:id", function(req, res) {
    blogModel.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            console.log("Error in the Show Soute!");
        } else {
            res.render("show", {
                blog: foundBlog
            });
        }
    });
});

// 5. Edit Route
app.get("/blogs/:id/edit", function(req, res) {
    blogModel.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            console.log("Error in the Edit Route");
        } else {
            res.render("edit", {
                blog: foundBlog
            });
        }
    });
});

// 6. Update Route
app.put("/blogs/:id", sanitizeBlog, function(req, res) {
    blogModel.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if(err) {
            console.log("Error in the Update Route");
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// 7. Destroy Route
app.delete("/blogs/:id", function(req, res) {
    blogModel.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log("Error in the Destroy Route");
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

function sanitizeBlog(req, res, next) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    next();
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started!");
});
