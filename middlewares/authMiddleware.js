import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected Routes token base

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (err) {
    res.status(401).send({
      success: false,
      message: "erro in requiresignIn",
    });
    console.log(err);
  }
};

//admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(401).send({
      success: false,
      err,
      message: "error in admin middleware",
    });
  }
};
