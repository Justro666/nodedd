const helper = require("../../helper/helper");
const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

AWS.config.update({
  accessKeyId: "DO00EMVCJYRP8VT8ZVEH",
  secretAccessKey: "h9agBm+4BQ7CinVt01OJ+mrGFBl4E9CCBTeiDnfzy2s",
  endpoint: "https://sgp1.digitaloceanspaces.com",
});
const s3 = new AWS.S3();

const uploadFile = async (
  bucketName,
  fileName,
  fileData,
  contentType,
  filePaths
) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: filePaths + "/" + fileName,
      Body: fileData,
      ACL: "public-read",
      ContentType: contentType,
      ContentDisposition: "inline",
    };
    const filePath = await s3.upload(params).promise();
    return filePath;
  } catch (error) {
    return helper.controllerMsg("System Error", error);
  }
};

const deleteFile = async (bucketName, filePath) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: filePath,
    };
    
    await s3.deleteObject(params).promise();
    return "Successful";
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
  }
};
module.exports = {
  uploadFile,
  deleteFile
};
