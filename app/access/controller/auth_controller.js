const helper = require("../../helper/helper");
const DB = require("../model/user");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const dbUser = await DB.findOne({ user_name: req.body.name }).select(
      "_id user_name password"
    );
    if (dbUser) {
      let pswCheck = helper.comparePass(req.body.password, dbUser.password);
      if (pswCheck) {
        let admin = dbUser.toObject();
        delete admin.password;
        helper.setRedis(admin._id,admin)
        admin.ip = req.ip
        admin.token = helper.token(admin);
        admin.refreshToken = helper.refreshToken(admin);
        helper.fmsg(res, "Login Success", admin);
      } else {
        next(new Error("Creditential Wrong!"));
      }
    } else {
      next(new Error("Creditential Wrong!"));
    }
  } catch (error) {
    next(new Error("Something Went Wrong"));
  }
};

const register = async (req, res, next) => {
  try {
    let userName = await DB.findOne({ name: req.body.name });
    // let AdminPassword = await DB.findOne({ password: hashpassword});
    if (userName) {
      next(new Error("Admin name is already exist"));
      return;
    }
    req.body.password = helper.encode(req.body.password);
    let data = await new DB(req.body).save();
    helper.fmsg(res, "Save Successful", data);
  } catch (error) {
    next(new Error("Register Server Error"));
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    jwt.verify(refreshToken, process.env.SECRET_KEY2, async function(
      err,
      decode
    ) {
      if (!err) {
        let user = await DB.findById(decode._id, "user_name createdAt");
        if (user) {
          let userD = user.toObject();
          let token = helper.token(userD);
          helper.fmsg(res, "Token Refresh Successfully", {
            token: token,
            refreshToken: refreshToken
          });
        } else {
          next(new Error("Invalid User"));
        }
      } else if (err.name == "TokenExpiredError") {
        next(new Error("Token Expire ! Please Relogin."));
      } else {
        next(new Error("Tokenization Error."));
      }
    });
  } catch (error) {
    next(new Error("Tokenization Error."));
  }
};

const loginS = async (req, res) => {
    const { username, password } = req.body
    const foundUser = await User.findOne({ username }).populate('profile').exec()
    if (!foundUser || !foundUser.active) {
        return ApiResponse.unauthorized(res)
    }
    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) return ApiResponse.unauthorized(res)
    const accessToken = jwt.sign(
        {
            "user_info": {
                "id":foundUser._id,
                "username": foundUser.username,
                "role": foundUser.role
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    )
    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )
    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })
    // Send accessToken containing username and role
    return ApiResponse.success(res,'login',{...UserDTO(req,foundUser),access_token:accessToken})
}

const refresh = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return ApiResponse.unauthorized(res)
    const refreshToken = cookies.jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return ApiResponse.forbidden(res)
            const foundUser = await User.findOne({ username: decoded.username }).exec()
            if (!foundUser) return ApiResponse.unauthorized(res)
            const accessToken = jwt.sign(
                {
                    "user_info": {
                        "id":foundUser._id,
                        "username": foundUser.username,
                        "role": foundUser.role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' }
            )
            return ApiResponse.success(res,'token',{access_token:accessToken})
        }
    )
}


const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}

module.exports = {
  login,
  register,
  refreshToken
};
