const helper = require("../../helper/helper")


const liveUser = async (socketId,user) =>{
    user['socketId'] = socketId,
    helper.setRedis(socketId,user._id)
}

const initialize = async(io,socket) =>{
    console.log(socket.user_data);
    socket['userDataId'] = user_data._id
}

module.exports = {
    initialize
}