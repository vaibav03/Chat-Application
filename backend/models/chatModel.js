// chatName
// isGroupChat
// users
// latestMessage
// groupAdmin

const mongoose = require("mongoose");

const chatModel = mongoose.Schema( 
    {
        chatName: { type: String, trim: true }, // we trim so that there is no trailing/back spaces
        isGroupChat: {type: Boolean, default: false },
        
        users: [{   // This is an array because a single chat wil have 2 users and groupchat will have multiple users 
            type: mongoose.Schema.Types.ObjectId, // This wil contain id to that particular user 
            ref: "User", // We are referencing it to user model 
        }] ,
        
        // Latest msg has to be displayed on the front, so we keep track of it

        latestMessage : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },

        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },

    // field for mongoose to add timestamp whenever a new data is entered 

    {
        timestamp: true, 
    }

);




const Chat = mongoose.model( "Chat", chatModel );
module.exports = Chat ;