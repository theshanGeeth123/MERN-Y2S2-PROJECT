import express from "express";
import {
  addCard,
  listCards,
  getCardForPrefill,
  deleteCard,
  updateCard
} from "../controllers/Cards.controller.js";

const router = express.Router();


router.post("/", addCard);

router.get("/", listCards);

router.get("/:id", getCardForPrefill);

router.delete("/:id", deleteCard);

router.put("/:id", updateCard);   

export default router;
