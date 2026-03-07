const User = require("../models/userModel");

const jwt = require("jsonwebtoken");

//===================== User authentication ==============

exports.authenticationUser = async (req, res, next) => {
  try {
    const token = req.headers["x-auth-token"];

    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: "Missing Auth token !" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async function(err, decoded) {
      if (err) {
        return res.status(401).json({ status: false, message: err.message });
      }



      const user = await User.findById(decoded._id).select({password:0});

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found !" });
      }

      req.user = user;

    // console.log(req.user)

      next();
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

//=================== Admin Manager Authorization ==========

exports.authorizationManagerAdmin = async (req, res, next) => {
  try {
    const allowedRole = ["Admin", "Manager"];

    if (allowedRole.includes(req.user.role)) {
      next();
    } else {
      return res
        .status(403)
        .json({ status: false, message: "Unauthorize Access" });
    }
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
