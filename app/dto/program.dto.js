const { BlogListDTO } = require("./blog.dto")

const ProgramDTO = (req,program) => ({
    id: program._id,
    title: program.title,
    category: program.category,
    blog_count:program.blogs.length,
    blogs:BlogListDTO(req,program.blogs)
})

const ProgramListDTO = (req,programs)=>programs.map(program=>ProgramDTO(req,program))


module.exports={
    ProgramDTO,
    ProgramListDTO
}