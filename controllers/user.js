const { User, Mechanic, Admin } = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.SECURE = async function (req, res, next) {
  try {
    let token = req.headers.authorization
    if(!token){
      throw new Error("Please attched token")
    }
    let tokenData = jwt.verify(token,'SURAT')
    console.log(tokenData.id);
    let checkUser = await USER.findById(tokenData.id)
    if(!checkUser){
      throw new Error("User not found")
    }
   next()
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
}

exports.SignupData = async function (req, res, next) {
  try {
    const signUp = req.body;
    if (!signUp.name || !signUp.email || !signUp.password || !signUp.role) {
      throw new Error("Please Enter Valid Fields");
    }
    signUp.password = await bcrypt.hash(signUp.password, 10);
    const data = await User.create(signUp);
  
    if (signUp.role === 'mechanic') {
      await Mechanic.create(signUp);
    } else if (signUp.role === 'admin') {
      await Admin.create(signUp);
    }
  
    let token = await jwt.sign({ id: data._id },'SURAT');
    res.status(201).json({
      message: "signUp Successful",
      data,
      token
    });
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
}

exports.LoginData = async function (req, res, next) {
  try {
    const loginData = req.body;
    if (!loginData.email || !loginData.password || !loginData.role) {
      throw new Error("Please Enter Valid Fields");
    }

    let checkUser;
    if (loginData.role === 'mechanic') {
      checkUser = await Mechanic.findOne({ email: loginData.email });
    } else if (loginData.role === 'admin') {
      checkUser = await Admin.findOne({ email: loginData.email });
    } else {
      checkUser = await User.findOne({ email: loginData.email });
    }

    if (!checkUser) {
      throw new Error("Email is Wrong");
    }

    const checkPass = await bcrypt.compare(loginData.password, checkUser.password);

    if (!checkPass) {
      throw new Error("password is wrong");
    }
    let token = await jwt.sign({ id: checkUser._id }, 'SURAT');
    res.status(200).json({
      message: "Login Successful",
      data: checkUser,
      token
    });
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
}