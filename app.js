const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors')
const path = require('path')

const port = process.env.port || 3000;
//cd C:\Program Files\MongoDB\Server\7.0\bin\
const bp = require("body-parser");
const requiredlogin = require('./middlewares/requiredlogin');
const { mongo_url } = require('./keys.js')
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
const createPost=require('./models/createPost.js')
const User=require('./models/signup.js')


app.use(require('./routes/auth'),   
    require('./routes/createPost') )

mongoose.connect(mongo_url
     
 )
mongoose.connection.on("connected", () => {
      console.log("database connected")
  })
mongoose.connection.on("error", () => {
    console.log("Database disconnected");
});

app.use(express.static(path.join(__dirname,"./frontend/dist")))
app.get('*', (req, res) => {
    
    res.sendFile(
        path.join(__dirname, "./frontend/dist/index.html"),
        function (err) {
            res.status(5000).send(err)
        }
    )
})
app.listen(port,()=>{console.log("server is working")})

