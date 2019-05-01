const Category = require('../models/category.js')

// Create and save a new Category
exports.create = (req, res) => {
  console.log(req.body);
  if(!req.body.title){
    return res.status(400).send({
      message: 'Category content required'
    });
  }
  
  // There is content, let's make a category!
  const category = new Category({
    title            : req.body.title || 'Untitled Category -- change this!',
    description      : req.body.description,
    parent           : req.body.parentId,
    author           : req.body.userId
  })
  
  // Our category is created, let's save it!
  category.save()
    .then(data => {
      if(req.body.parentId){
        Category.findById(req.body.parentId)
           .then(parent => {
             if(parent){
               parent.children.push(data._id);
               parent.save();
             }
           })
      }
      res.send(data);
    }).catch(err =>{
      res.status(500).send({
        message: err.message || 'Some sort of error bit you inna BUTT.'
      });
    });
  
};

// Retrieve and return the root node and its immediate children
exports.findRoot = (req, res) => {
  Category.findOne({parent: null})
    .then(category => {
      if(!category){
        return res.status(404).send({
          message: 'Root category not found'
        });
      }
    category = category.toObject();
      category.children = category.children.map((child, index, collection) =>{
        return {
          _id: child,
          url: `/api/categories/${child}`
        }
      })

      console.log(category);
      res.send(category);
    }).catch(err =>{
      if(err.kind === 'ObjectId'){
        return res.status(404).send({
          message: 'Root category not found'
        });
      }
      return res.status(500).send({
        message: 'Error retrieving root category'
      });
    });
};

// Retrieve and return the given categoryId node and its immediate children
exports.findOne = (req, res) => {
  Category.findById(req.params.categoryId)
    .then(category => {
      if(!category){
        return res.status(404).send({
          message: `Category not found with id ${req.params.categoryId}`
        })
      }
      res.send(category);
    }).catch(err =>{
      if(err.kind === 'ObjectId'){
        return res.status(404).send({
          message: `Category not found with id ${req.params.categoryId}`
        })
      }
      return res.status(500).send({
        message:  `Error retrieving category with id ${req.params.categoryId}`
      })
    })
};

// Update a given Category with the specified categoryId
exports.update = (req, res) => {
  const updater = {};
  if (req.body.title)
    updater.title = req.body.title;
  if (req.body.description)
    updater.description = req.body.description;

  Category.findByIdAndUpdate(req.params.categoryId, updater, {new: true})
    .then(category => {
      if(!category){
        return res.status(404).send({
          message: `Category not found with id ${req.params.categoryId}`
        })
      }
      res.send(category);
    }).catch(err =>{
      if(err.kind === 'ObjectId'){
        return res.status(404).send({
          message: `Category not found with id ${req.params.categoryId}`
        })
      }
      return res.status(500).send({
        message:  `Error retrieving category with id ${req.params.categoryId}`
      })
    })
  
};

// Change the order of the children array
exports.sortChildren = (req, res) => {
  Category.findByIdAndUpdate(req.params.categoryId, {
    children: req.body.children
  }, {new: true})
    .then(category => {
      if(!category){
        return res.status(404).send({
          message: `Category not found with id ${req.params.categoryId}`
        })
      }
      res.send(category);
    }).catch(err =>{
      if(err.kind === 'ObjectId'){
        return res.status(404).send({
          message: `Category not found with id ${req.params.categoryId}`
        })
      }
      return res.status(500).send({
        message:  `Error retrieving category with id ${req.params.categoryId}`
      })
    })
};

// Delete the given Category node
exports.delete = (req, res) => {
  
};