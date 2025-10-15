import express from 'express';
import { getAllContacts, getMessagesByUSerId, sendMessage, getChatPartners } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';

const router = express.Router();

router.use(arcjetProtection, protectRoute)

// instead of duplication the middlewares will run in order.
// more efficient 
//first the rate limmiter then the route protection


router.get("/contacts",  getAllContacts)
router.get("/chats",  getChatPartners)
router.get("/:id",  getMessagesByUSerId)
router.post("/send/:id",  sendMessage)





export default router