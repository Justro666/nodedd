const jwt = require("jsonwebtoken");
const ApiResponse = require('../../helper/apiResponse')
const userDB = require("../model/user");
const helper = require("../../helper/helper");

module.exports = {
  // validateBody: schema => (req, res, next) => {
  //   const { error, value } = schema.validate(req.body, { abortEarly: false });
  //   if (error) {
  //     return ApiResponse.badrequest(res,joi_error(error.details))
  //   } else {
  //     next();
  //   }
  // },
  validateBody: schema => (req, res, next) => {
      let result = schema.validate(req.body);
      if (result.error) {
        next(new Error(result.error.details[0].message));
      } else {
        next();
      }
    },
  validateParams: (schema, params) => {
    return (req, res, next) => {
      let data = {};
      if (Array.isArray(params)) {
        for (let i = 0; i < params.length; i++) {
          data[`${params[i]}`] = req.params[`${params[i]}`];
        }
      } else {
        data[`${params}`] = req.params[`${params}`];
      }
      let result = schema.validate(data);
      if (result.error) {
        next(new Error(result.error.details[0].message));
      } else {
        next();
      }
    };
  },
   verifyJWT : (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return ApiResponse.unauthorized(res)
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return ApiResponse.forbidden(res)
            req.user_id=decoded.user_info.id
            req.user = decoded.user_info.username
            req.role = decoded.user_info.role
            next()
        }
    )
},
  validateToken: async (req, res, next) => {
    let token = await req.headers.authorization;
    try {
      token = token
        ? token.split(" ")[1]
        : next(new Error("Tokenization Error. Please login !"));
      // token = token.replace(/^"(.*)"$/, "$1"); Laravel
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return ApiResponse.forbidden(res)
            // let user = await userDB.findById(decoded._id, "user_name createdAt")
            let user = helper.getRedis(decoded._id)
            if (!user) return ApiResponse.unauthorized(res)
            req.user_id=decoded.user_info.id
            req.user = decoded.user_info.username
            req.role = decoded.user_info.role
            next()
        }
    )
      jwt.verify(token, process.env.SECRET_KEY1, async function(err, decode) {
        if (!err) {
          let user = await userDB.findById(decode._id, "user_name createdAt");
          if (user) {
            req.body["user"] = user;
            next();
          } else {
            next(new Error("Tokenization Error. Please login !"));
          }
        } else if (err.name == "TokenExpiredError") {
          next(new Error("Token Expire. Refresh token"));
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
};
