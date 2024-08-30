const mongoose = require('mongoose');

const { ObjectId}=mongoose.Schema.Types

const { Schema } = mongoose;

const createpostSchema = new Schema(
    {
    
        body: {
            
            type:String,
        required:true
        }
,
        likes: [{
            type: ObjectId,
    ref:'User'
}],
comments: [{
    comment:{    type: String
    },
    postedBy:{type:ObjectId ,   ref:'User'
}
}]
,
        postedBy:
        
        {type:ObjectId,
ref:'User'
        }, photo: {
            type: String,
                    required:true

}

  }
,{timestamps:true}


)

const createPost = mongoose.model("CreatePost", createpostSchema)
module.exports = createPost;