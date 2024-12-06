import express from "express";
import { registerUser, loginUser } from "../controllers/userController";
import { insertSampleData } from "../controllers/sampleController";

const router = express.Router();

// Endpoint for user registration
router.post("/register", registerUser);

// Endpoint for user login
router.post("/login", loginUser);

router.post("/insert-sample-data", insertSampleData);

export default router;
