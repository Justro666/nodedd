const success = (res,msg="success",data,pagination)=>{
    res.status(200).json({
        message:msg,
        data:data && data,
        pagination:pagination && pagination
    })
}
const created = (res,msg="success",data)=>{
    res.status(201).json({
        message:msg,
        data:data && data
    })
}
const badrequest = (res,msg)=>{
    res.status(400).json({
        errors:msg,
    })
}
const unauthorized = (res,msg="unauthorized")=>{
    res.status(401).json({
        message:msg,
    })
}
const forbidden = (res,msg="forbidden")=>{
    res.status(403).json({
        message:msg,
    })
}
const notfound = (res,msg="404 not found")=>{
    res.status(404).json({
        message:msg,
    })
}
const duplicate = (res,msg="data duplicated")=>{
    res.status(409).json({
        message:msg,
    })
}
const server = (res,msg="server error")=>{
    res.status(500).json({
        message:msg,
    })
}

module.exports={
    success,
    created,
    badrequest,
    unauthorized,
    forbidden,
    notfound,
    duplicate,
    server
}



