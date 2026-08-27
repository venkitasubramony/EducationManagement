import jwt from 'jsonwebtoken'

const authMiddleWare = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).send('Token does not exist');
    }
    //decode this token
    try{
        const decodedInfo = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.userInfo = decodedInfo;
        next();
    }catch(err){
        return res.status(500).send('Access Denied. No token provided.');
    }
    

}
export default authMiddleWare;