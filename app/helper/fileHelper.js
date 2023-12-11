const FileUpload = require("../../../Blog Management User/app/access/models/FileUpload");
const fs = require("fs");
const mkdirUpload = async () => {
  const uploadDir = "./uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  return;
};
const upload = async file => {
  await mkdirUpload();
  const filename = new Date().valueOf() + "_" + file.name;
  file.mv(`./uploads/${filename}`);
  const image = await FileUpload.create({ url: filename });
  return image._id.toString();
};
const uploads = async files => {
  mkdirUpload();
  let fileNames = [];
  files.forEach(file => {
    let filename = new Date().valueOf() + "_" + file.name;
    file.mv(`./uploads/${filename}`);
    fileNames.push({ url: filename });
  });
  let images = await FileUpload.create(fileNames);
  let result = images.map(image => image._id.toString());
  return result;
};

module.exports = {
  upload,
  uploads
};
