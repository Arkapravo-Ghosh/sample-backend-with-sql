import { Router } from "express";
import { registerUser } from "../controllers/userController.js";

const router = Router();

router.post("/", (req, res) => {
  try {
    registerUser(req, res);
  } catch (error) {
    if (process.env.PRODUCTION === "false") console.log(error);
    res.status(500).json("Server error");
  };
});

export default router;
