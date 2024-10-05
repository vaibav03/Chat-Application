const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected

// responsible for fetching one-one chats

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  
  // chat doesnt exist with this userid ,

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [     // both requests have to be true
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })

  .populate("users", "-password")  // chatModel has only user id, so we get the rest of the user data other than password
  .populate("latestMessage");  // get all info of last message

  // we are populating the sender field in messageModel 

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  // if chat exists, send the chat 
  if (isChat.length > 0) {
    res.send(isChat[0]);
  }
 
  // or create a new chat 
  else {
        var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
    };


    try {
        // create new chat 
        const createdChat = await Chat.create(chatData);    
        
        // find the newly created chat and populate
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
      );
      res.status(200).json(FullChat);
    } 
    
    catch (error) {
      res.status(400);
      throw new Error(error.message);
    }

  }
});



/*********************************************************/



//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {

  try {
        
  // just see which user is logged in and
  // go through all the chats and return the ones in which this user is a part of

        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }) //users array

        // populate the user, groupAdmin, latestmessage 
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")

        // Sort from new to old 
        .sort({ updatedAt: -1 })

        .then(async (results) => {
        results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

        res.status(200).send(results);

        });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});



/*********************************************************/



//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected

// requires chat name and the users 

const createGroupChat = asyncHandler(async (req, res) => {

  // check if all fields are there 

  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  // we need to send an array, it can't be directly done
  // so we send it in the stringify format from frontend
  // and parse it into object in backend

  var users = JSON.parse(req.body.users);

  // we need atleast 2 users for group chat 

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  // we add the logged in user as well
  users.push(req.user);

  // create new chat
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    // fetch the groupchat and send it to the user 

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});




/*********************************************************/


// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});



/*********************************************************/



// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});



/*********************************************************/




// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};