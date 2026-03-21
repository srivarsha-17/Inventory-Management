
const UserModel = require("../Models/User")

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

const signup = async (req,res)=>{
    try{
        const {name,email,password,role,projectCode} = req.body;
        const user = await UserModel.findOne({email});
        if(user){
            return res.status(409).json({message : "user already exist,you can login directly ",success : false})
        }
        const userModel = new UserModel({name,email,password,role,projectCode})
        userModel.password = await bcrypt.hash(password,10);
        await userModel.save();
        res.status(201).json({message : "Signup successful",success: true});
    }
    catch(err){
        res.status(500).json({message : "Internal server error",success: false})

    }

}


const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user  = await UserModel.findOne({email});
        if(!user){
            return res.status(403).json({"message" : "User doesn't exist. Signup first","success" : "false"})
        }
        const result = await bcrypt.compare(password,user.password)
        if(!result){
           return res.status(403).json({"message" : "Wrong password","success" : "false"})
        }
        const jwtToken = jwt.sign({email: user.email,_id: user._id,role: user.role,projectCode : user.projectCode},
            process.env.JWT_SECRET,{expiresIn : '24h'}
        )
        res.status(200).json({
          "message": "Login successful",
          "success": true,
          jwtToken,
          email: user.email,
          name: user.name,
          role: user.role,
          projectCode: user.projectCode
        })
       

    }
    catch(err){
        res.status(500).json({message : "Internal server error",success: false})

    }
}


module.exports = {
    signup,login
}