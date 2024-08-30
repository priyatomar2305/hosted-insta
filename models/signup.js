const mongoose = require('mongoose');
const { ObjectId}=mongoose.Schema.Types


const { Schema } = mongoose;

const signupSchema = new Schema({
  username: String, // String is shorthand for {type: String}
  name: String,
    password:
        String,
  email: String,
 Photo:String,


  followers: [
    {
      type: ObjectId,
      ref:'User'
    }
  ]
  ,
 following: [
    {
      type: ObjectId,
      ref:'User'
    }
  ]  
  ,
  

  
});

const User = mongoose.model('User', signupSchema);

module.exports= User;