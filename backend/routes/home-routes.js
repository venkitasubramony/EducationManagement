import express from "express";
const router = express.Router();
import authMiddleWare from "../middleware/auth-middleware.js";

router.get('/welcome',authMiddleWare,(req,res)=>{
    res.status(200).send('welcome to Home page');
});

export default router;