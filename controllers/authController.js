import { comparePassword, hashPassword } from "../helpers/authHelpers.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    //
    if (!name) {
      return res.send({ error: "Name is required" });
    }
    if (!phone) {
      return res.send({ error: "Phone is required" });
    }
    if (!password) {
      return res.send({ error: "Password is required" });
    }
    if (!email) {
      return res.send({ error: "Email is required" });
    }
    if (!address) {
      return res.send({ error: "Address is required" });
    }

    //check user
    const existingUser = await userModel.findOne({ email });

    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "Already register please login..",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);

    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();

    res.status(200).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      err,
    });
  }
};

//POST LOGIN

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      err,
    });
  }
};


//test controlller

export const testController = (req,res)=>{
    try{
        res.send("Protected Rout")
    }catch(err){
        console.log(err)
        res.send({err})
    }
}