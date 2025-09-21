import express from "express";
import { 
    deleteRentItems, 
    getRentItems, 
    postRentItems, 
    updateRentItems 
} from "../controllers/mRental.controller.js";


const router = express.Router();

router.post("/", postRentItems);
router.get("/", getRentItems);
router.put("/:id", updateRentItems);
router.delete("/:id", deleteRentItems);

export default router;
