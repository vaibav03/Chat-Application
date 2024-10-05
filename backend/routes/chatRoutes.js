const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// for accessing or creating the chat 
// only logged in user should accces it, so we use protect

router.route("/").post(protect, accessChat);

// get all chats for that particular user
router.route("/").get(protect, fetchChats);

// for group creaation
router.route("/group").post(protect, createGroupChat);

// since we are updating en entry, its a put request
router.route("/rename").put(protect, renameGroup);

//
router.route("/groupremove").put(protect, removeFromGroup);

router.route("/groupadd").put(protect, addToGroup);

module.exports = router;