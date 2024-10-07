import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import { createError } from "../../utils/error.js";
import sendMail from "../../utils/Emails/sendEmail.js";
import crypto from "crypto";

//function to handle sign token
const jwtSign = (id, role,isSeller) => {
  return jwt.sign({ id, role,isSeller }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
// ########################################################################
//@desc   Register a new user
//route   POST /api/auth/register
//@access Public

export const register = async (req, res, next) => {
  const { username, role, avatar, acceptPrivacyPolicy } = req.body;

  try {
    //Check if user exist
    let user = await User.findOne({ username });
    if (user) {
      return next(createError(400, "User already exists!"));
    }
    //CHECK IF REQUEST DATA CONTAIN ROLE ||AVTAR
    if (role)
      return next(createError(400, "You don't have permission to assign role"));
    if (avatar)
      return next(createError(400, "Avatar can't be uploaded from here"));
    if (acceptPrivacyPolicy !== "Yes")
      return next(
        createError(400, "You must accept our Privacy Policy inorder to register a new account")
      );
    //Create User
    user = new User({
      ...req.body,
    });
    await user.save();

    //JWT Token
    const token = jwtSign(user._id, user.role,user.isSeller);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 86_400_000,
      })
      .status(201)
      .json({
        name: user.username,
      });
  } catch (err) {
    next(err);
  }
};
// ########################################################################

//@desc  Login user
//route   POST /api/auth/login
//@access Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //Check if Email ID or Password was provided
    if (!email || !password)
      return next(
        createError(400, "Please provide email ID & Password for login!")
      );
    //Check If User Exist
    const user = await User.findOne({ email }).select("+password");

    //Compare Password
    // const isPswdMatch = await user.comparePWD(password, user.password);
    if (!user || !(await user.comparePWD(password, user.password)))
      return next(createError(400, "Access Denied. Invalid Credential!"));

    const token = jwtSign(user._id, user.role);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 86_400_000,
      })
      .status(200)
      .json({
        name: user.fullName,
      });
  } catch (err) {
    next(err);
  }
};

// ########################################################################
//@desc  Forgot Password
//route   POST /api/v1/auth/forgotPassword
//@access Public

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    //1. GET USER BASED ON POSTED EMAIL
    const user = await User.findOne({ email });
    if (!user)
      return next(createError(404, "We could not find user with given email"));
    //2. GENERATE A RANDOM RESET TOKEN
    const resetToken = user.createPswdResetToken();
    await user.save({ validateBeforeSave: false });
    //3. SEND THE TOKEN BACK TO THE USER EMAIL
    // const pswdResetLink = `https://kueentair.com/api/v1/auths/reset_password`;
    const pswdResetLink = `localhost:5000/api/v1/auths/reset_password`;
    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auths/reset_password/${resetToken}`;
    const message = `We received request that you want to reset your Kanstars Vision password. Sorry about the lost password!\nBut don’t worry! You can use the following button to reset your password:\n\n${url}\n\nIf you don’t use this link within 10 minutes, it will expire. To get a new password reset link, visit: ${pswdResetLink}\n\nThanks,\nKanstars Vision Team`;

    await sendMail({
      email: user.email,
      subject: "Please reset your password",
      message: message,
    });
    res.status(200).json({
      success: true,
      message: "Password reset link sent to the user email.",
    });
  } catch (err) {
    user.pswdResetToken = undefined;
    user.pswdResetTokenExpries = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      createError(
        500,
        "There was an error sending password reset email. Please try again later."
      )
    );
  }
};
// ########################################################################
//@desc  Reset Password
//route   PATCH /api/v1/auth/reset_password
//@access Public
export const resetPassword = async (req, res, next) => {
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      pswdResetToken: token,
      pswdResetTokenExpries: { $gt: Date.now() },
    });

    if (!user)
      return next(createError(401, "Token is invalid or  has expired!"));
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.pswdResetToken = undefined;
    user.pswdResetTokenExpries = undefined;
    user.pswdChangedAt = Date.now();
    await user.save();

    //JWT Token
    const loginToken = jwtSign(user._id, user.role);

    res
      .cookie("access_token", loginToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 86_400_000,
      })
      .status(201)
      .json({
        success: true,
        message: "Password reset successful.",
      });
  } catch (err) {
    next(err);
  }
};

// ########################################################################
//@desc  Logout user
//route   POST /api/auth/logout
//@access Public

export const logout = async (req, res, next) => {
  try {
    res.cookie("access_token", "", {
      httpOnly: true,
      expires: new Date(),
    });
    res.status(200).json({ success: true, message: "User logged out" });
  } catch (err) {
    next(err);
  }
};
