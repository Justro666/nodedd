const {  date_format, single_file_format, url } = require("../utils/helper")

const BlogDTO = (req,blog) => ({
    id: blog._id,
    author: blog.author,
    title: blog.title,
    category: blog.category,
    description: blog.description,
    date: date_format(blog.date),
    images: single_file_format(req, blog.images),
    todo:blog.todo,
    is_published: blog.is_published,
    programs:blog.programs.filter((v, i, a) => a.indexOf(v) === i),
    latest:blog.latest,
    // author_image:blog.author_image? single_file_format(req,blog.author_image):"",
    trending:blog.trending,
    pending:blog.is_pending
})

const BlogListDTO = (req,blogs)=>blogs.map(blog=>BlogDTO(req,blog))


module.exports={
    BlogDTO,
    BlogListDTO
}