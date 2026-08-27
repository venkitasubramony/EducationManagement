const isAdminUser = (req,res,next)=>{
    if(req.userInfo !== 'admin'){
         return res.status(401).send('You do not have admin rights');
    }
    next();
}
export default isAdminUser;