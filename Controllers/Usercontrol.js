const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../Models/Usermodel");
require("dotenv").config();

exports.signup = async(req,res) =>{
    try {
        const {name,email,password} = req.body;

        // check if user already exist
        const existuser = await user.findOne({email});

        if (existuser){
            return res.status(400).json({
                success:false,
                message:"User already exist"
            })
        }

        // secure password by hashing

        let hashpassword;
        try {
            hashpassword = await bcrypt.hash(password,10);
        } catch (error) {
            return res.status(500).json({
                success:false,
                massage:"error in securing"
            })
        }

        const User = new user({
            name,email,password:hashpassword
        })
        const saveduser = User.save();

        return res.status(200).json(
            {
                success:true,
                massage:"successfully User created"
            }
        )

    } catch (error) {
        console.log("error happen in signup");
        console.error(error.massage);
        return res.status(500).json(
            {
                success:false,
                massage:"error happen in signup"
            }
        )
    }
}

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if user already gave required details or not 
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please fill all required details"
            });
        }

        // check if user already exists
        const registereduser = await user.findOne({ email });

        if (!registereduser) {
            return res.status(401).json({
                success: false,
                message: "please sign-up first"
            });
        }

        // payload for JWT token
        const payload = {
            email: registereduser.email,
            id: registereduser._id,
        };

        // password verification by compare function and generate jwt token 
        if (await bcrypt.compare(password, registereduser.password)) {
            let token = jwt.sign(payload, process.env.JWT_Secret, {
                expiresIn: "2h",
            });

            let updatedUser = registereduser.toObject();
            updatedUser.token = token;
            updatedUser.password = undefined;

            let options = {
                httpOnly: true,
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                registereduser: updatedUser,
                message: "user login successful"
            });
        } else {
            // password does not match
            return res.status(403).json({
                success: false,
                message: "password does not match"
            });
        }
    } catch (error) {
        console.log("An error occurred in Login:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred in Login",
            error: error.message
        });
    }
};
