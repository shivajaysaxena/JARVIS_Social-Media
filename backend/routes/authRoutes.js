import express from "express";
import { signup, login, logout, getMe, setLocations } from "../controllers/authController.js"
import protectRoute from "../middleware/protectRoute.js"
const router = express.Router();

router.get("/me", protectRoute, getMe)
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/location",protectRoute, setLocations)

export default router; 