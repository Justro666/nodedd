const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const Redis = require("async-redis").createClient();
const url = process.env.SPACE_URI;
module.exports = {
  fmsg: (res, msg = "", result = []) =>
    res.status(200).json({ con: true, msg, result }),
  encode: password => bcrypt.hashSync(password, 10),
  comparePass: (plain, hash) => bcrypt.compareSync(plain, hash),
  token: payload =>
    jwt.sign(payload, process.env.SECRET_KEY1, { expiresIn: "7d" }),
  refreshToken: payload =>
    jwt.sign(payload, process.env.SECRET_KEY2, { expiresIn: "48h" }),
  getPaginationInfo: (page, limit, count) => {
    return {
      page: +page,
      limit: +limit,
      totalCount: count,
      totalPages: Math.ceil(count / limit)
    };
  },
  generate_password: (passLength = 10) => {
    let chars =
      "0123456789~!@#$%^&*()_+}{[]|abcdefghikjlmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let pass = "";
    for (let i = 0; i < passLength; i++) {
      let randPass = Math.floor(Math.random() * chars.length);
      pass += chars.substring(randPass, randPass + 1);
    }
    return pass;
  },
  joi_error: errors =>
    Object.assign(
      {},
      ...errors.map(err => {
        return { [err.path[0]]: err.message };
      })
    ),
  file_format: (req, files) =>
    files.map(file => {
      return {
        id: file._id,
        url: url(req) + "/uploads/" + file.url
      };
    }),
  single_file_format: (file, path) => ({
    id: file._id,
    url: url + path + file.url
  }),
  date_format: date => moment(date).format("YYYY-MM-D h:mm:ss"),
  url :(req) => `${req.protocol}://${req.get('host')}`,
  setRedis: async (id, value) =>
    await Redis.set(id.toString(), JSON.stringify(value)),
  getRedis: async id => JSON.parse(await Redis.get(id.toString())),
  dropRedis: async id => await Redis.del(id.toString())
};
