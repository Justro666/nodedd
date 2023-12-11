const Blog = require("../../../Blog Management User/app/access/models/Blog")
const { upload } = require("../utils/fileHelper");
const { BlogDTO, BlogListDTO } = require("../dto/blog.dto");
const ApiResponse = require('../utils/apiResponse');
const { getPaginationInfo, date_format } = require("../utils/helper");
const Program = require("../../../Blog Management User/app/access/models/Program");

const getAllBlogs = async (req, res) => {

    let limit = parseInt(req.query.limit) || 10
    let page = parseInt(req.query.page) - 1 || 0
    let query = {is_pending:false}
    if (req.query?.published) {
        query = { is_published: true }
    }
    if (req.query?.category) {
        query = { ...query, category: req.query.category }
    }
    if (req.query?.user) {
        query = { ...query, user: req.query.user == "me" ? req.user_id : req.query.user }
    }
    if (req.query?.pending) {
        query = { ...query, is_pending: true }
    }
    const blogs = await Blog.find(query).sort({ createdAt: -1 }).skip(limit * page).limit(limit).populate('images').populate('author_image').populate('user').exec()
    // return res.json(blogs)
    const count = await Blog.countDocuments(query);
    
    return ApiResponse.success(res, 'blog list', BlogListDTO(req, blogs), getPaginationInfo(page + 1, limit, count))

}

const createBlog = async (req, res) => {

    if (!req.files?.images) {
        ApiResponse.badrequest(res, 'image is required')
    }
    const { title, category, description, date, author, todo } = req.body
    // let author_image="";
    // if (req.files?.author_image) {
    //     author_image = await upload(req.files.author_image)
    // }

    const image = await upload(req.files.images)
    const blog = await Blog.create({ user: req.user_id, title, category, images: image, description, author, date: date_format(date), todo:todo.split(',') })

    return ApiResponse.created(res, 'successfully created', BlogDTO(req, blog))
}

const updateBlog = async (req, res) => {

    const { id, title, category, description, date, author, todo } = req.body

    const blog = await Blog.findById(id).populate('images').populate('user').exec()

    !blog && ApiResponse.notfound(res)

    blog.title = title;
    blog.author = author;
    blog.category = category;
    blog.description = description;
    blog.date = date_format(date)
    blog.todo = todo
    if (req.files?.images) {
        blog.images = await upload(req.files.images)
    }
    // if (req.files?.author_image) {
    //     blog.author_image = await upload(req.files.author_image)
    // }
    await blog.save()

    return ApiResponse.created(res, 'successfully updated')
}

const deleteBlog = async (req, res) => {
    const { id } = req.body
    const blog = await Blog.findById(id).exec()
    !blog && ApiResponse.notfound(res)
    blog.is_deleted = true;
    await blog.save()
    return ApiResponse.created(res)
}

const showBlog = async (req, res) => {
    const { id } = req.params
    const blog = await Blog.findById(id).populate('images').populate('user').exec()
    !blog && ApiResponse.notfound(res)
    blog.is_deleted = true;
    await blog.save()
    return ApiResponse.success(res, 'blog', BlogDTO(req, blog))
}

const publishBlog = async (req, res) => {
    const { id } = req.body
    const blog = await Blog.findById(id).exec()
    !blog && ApiResponse.notfound(res)
    blog.is_pending = false;
    blog.is_published = req.params.status=='true';
    await blog.save()
    return ApiResponse.success(res, 'blog', BlogDTO(req, blog))
}

const blogTag = async (req, res) => {

    if (req.params.tag == 'trending') {
        await Blog.updateMany({ '_id': { $in: req.body.blogs } }, { $set: { trending: true } })
    } else if (req.params.tag == 'latest') {
        await Blog.updateMany({ '_id': { $in: req.body.blogs } }, { $set: { latest: true } })
    }
    return ApiResponse.success(res)
}

const blogTagList = async (req,res)=>{
    let query={}
    if (req.params.tag == 'trending'){
        query={trending:true}
    } else if (req.params.tag == 'latest') {
        query={latest:true}
    }
    const blogs = await Blog.find(query,"-description -todo").sort({ createdAt: -1 }).populate('images').populate('user').exec()
    return ApiResponse.success(res,`${req.params.tag} blogs`,BlogListDTO(req,blogs))
}

const removeBlogTag = async (req,res)=>{
    const {tag,id}=req.params
    const blog=await Blog.findById(id)
    switch(tag){
        case "trending":
            blog.trending=false
            break
        case "latest":
            blog.latest=false
            break
    }
    await blog.save()
    return ApiResponse.success(res,`remove from ${tag}`)
}
const removeBlogProgram = async (req,res)=>{
    const {program_id,blog_id}=req.params
    const program = await Program.findById(program_id)
    program.blogs=program.blogs.filter(blog=>blog!=blog_id)
    await program.save()
    const blog =await Blog.findById(blog_id)
    blog.programs=blog.programs.filter(program_name=>program_name!=program.title)
    await blog.save()
    return ApiResponse.success(res,'removed')

}

module.exports = {
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    showBlog,
    publishBlog,
    blogTag,
    blogTagList,
    removeBlogTag,
    removeBlogProgram
}