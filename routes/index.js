import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json("Server is Up!");
});

export default router;