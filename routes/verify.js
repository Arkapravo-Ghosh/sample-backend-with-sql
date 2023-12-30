import { Router } from "express";
import { verifyAuthToken } from "../controllers/userController.js";

const router = Router();

router.post("/", (req, res) => {
  try {
    const { authToken } = req.body;
    const result = verifyAuthToken(authToken);
    if (result) {
      res.status(200).json("Valid token");
    } else {
      res.status(401).json("Invalid token");
    };
  } catch (error) {
    if (process.env.PRODUCTION === "false") console.log(error);
    res.status(500).json("Server error");
  };
});

export default router;
