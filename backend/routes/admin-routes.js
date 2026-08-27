import express from "express";
const router = express.Router();
import authMiddleWare from "../middleware/auth-middleware.js";
import adminMiddleWare from "../middleware/admin-middleware.js";

router.get('/welcome',authMiddleWare,adminMiddleWare,(req,res)=>{
    res.status(200).send('welcome to Admin page');
});

export default router;