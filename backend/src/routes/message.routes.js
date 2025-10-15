import express from 'express';
import { getAllContacts, getMessagesByUSerId, sendMessage, getChatPartners } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get("/contacts", protectRoute, getAllContacts)
router.get("/chats", protectRoute, getChatPartners)
router.get("/:id", protectRoute, getMessagesByUSerId)
router.post("/send/:id", protectRoute, sendMessage)





export default router