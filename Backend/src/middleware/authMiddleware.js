import jwt from 'jsonwebtoken';

const auth = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET);

        req.user = decode;

        next();
    }catch(error){
        console.log("Error in authentication file", error)
        return res.status(401).send({success: false, message: "Invalid token"})
    }
}

export default auth;