const slugify = require('slugify')
const Category = require('../models/category');



const createCategories = (categories, id=null) => {
    const categoryList = []
    let category;
    if (id === null) {
        category = categories.filter(cat => cat.parentId == undefined)
    } else {
        category = categories.filter(cat => cat.parentId == id)
    }

    for (let cat of category) {
        categoryList.push({
            _id: cat._id,
            name: cat.name,
            slug: cat.slug,
            parentId: cat.parentId,
            type: cat.type,
            children: createCategories(categories, cat._id) 
        })
    }
    return categoryList;
}



exports.addCategory =  (req, res) => {

    res.setHeader('Content-Type', 'application/json')
    
    const {name, parentId} = req.body;
    const slug = slugify(req.body.name);
    
    const category = {
        name, slug
    }
    if (req.file) {
        category.categoryImage = `/public/${req.file.filename}`
    }
    if (parentId) {
        category.parentId = parentId;
    }
    try {
        // check if category already exists
        Category.findOne({name})
        .then( cat => {
            if (cat) {
                
                return res.status(400).send(JSON.stringify({error: 'Category already exist!'}))
            }
            const newCategory = new Category(category)
            newCategory.save( (error, category ) => {
            if (error) return res.status(400).json({error: error})
    
            if (category) {
                return res.status(200).json({category})
            }
        })
    });
    } catch (error) {
        res.status(400).send(JSON.stringify({error: `Unable to create category `}))
    }
    


}

exports.getCategories = (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    try {
        Category.find()
        .exec( (err, categories) => {
            if (err) return res.status(400).send(JSON.stringify({error: err}))
            if (categories) {
                const categoryList = createCategories(categories)
                return res.status(200).send(JSON.stringify(categoryList))
            }
        })
    } catch (error) {
        res.status(400).send(JSON.stringify({error: `Unable to get catgories`}))
    }
   

}

exports.updateCategories = async (req, res) => {
    try {
        const {_id, name, parentId, type} = req.body
       
        const updatedCategories = []
        if (name instanceof Array) {
            for(let i=0; i<name.length; i++) {
                const category = {
                    name: name[i],
                    type: type[i]
                }
                if (parentId[i] !== "") {
                    category.parentId = parentId[i]
                }
                const updatedCategory = await Category.findOneAndUpdate({_id: _id[i]}, category, {new: true})
                updatedCategories.push(updatedCategory)
            }
            return res.status(201).send(JSON.stringify({updatedCategories}))
        } else {
            const category = {
                name,
                type
            }
            if (parentId !== "") {
                category.parentId = parentId;
            }
            const updatedCategory = await Category.findOneAndUpdate({_id}, category, {new: true})
            return res.status(201).send(JSON.stringify({updatedCategory}))


        }
        
    } catch (error) {
        res.status(400).send(JSON.stringify({error: `Unable to update categories ${error}`}))
    }
} 

exports.deleteCategories = async (req, res) => {
    try {
        const {ids} = req.body.payload;
        const deletedCategories = []
        for (let i=0; i< ids.length; i++) {
            const deleteCategory = await Category.findOneAndDelete({_id: ids[i]._id})
            deletedCategories.push(deleteCategory)
        }
        if (deletedCategories.length === ids.length) {

            return res.status(201).send(JSON.stringify({message: `Categories removed`}))
        } else {
            return res.status(400).send(JSON.stringify({message: "Something went wrong"}))
        }

    } catch (error) {
        res.status(400).send(JSON.stringify({error: `Unable to delete categories ${error}`}))

    }
}

