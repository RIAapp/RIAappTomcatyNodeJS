//framework
const express = require('express');
//configure paths
const path = require("path");
const app = express();

//getting our posts routes
const posts = require("./server/routes/posts");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.static(path.join(__dirname,"dist")));

//using middleware
app.use("/getfile",posts);

const port = 4200;

app.listen(port, (req,res)=>{
    console.log('running on port ' + port);
    
    
});








//catch all other routes request and return it to index
// app.get("*", (req,res)=>{
//     res.sendFile(path.join(__dirname,"dist/index.html"));
    
// });

