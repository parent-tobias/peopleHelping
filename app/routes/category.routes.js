module.exports = (app, passport, user) => {
  const categories = require('../controllers/category.controller.js');
  
    // define some roles here, to limit which routes are accessible to whom
  /***
   * First, we define roles specifically limited to anonymous users.
   *  If we return false here, any other rules are not run.
   ***/
  user.use(function(req, action){
    if(!req.isAuthenticated() ) return action === 'access public page'
  });
  
  // Members can access basic member pages, but so can others.
  //  because of this, we don't return false if the user isn't a mod.
  user.use('access member page', function(req){
    if(req.user.local.role === 'member' || req.user.local.role === 'provider' || req.user.local.role === 'admin'){
      return true;
    }
  });
  
  user.use('access provider page', function(req){
    if(req.user.local.role === 'provider' || req.user.local.role === 'admin'){
      return true;
    }
  });
  
    // Admin users can go ANYWHERE
  user.use(function(req){
    if(req.user.local.role === 'admin'){
      return true;
    }
  })
  
  // Add a new category
  app.get('/categories', user.can('access public page'), (req, res)=>{
    user = user ? user : undefined;
    res.render('categories');
  });
  
  // Retrieve all top-level categories
  app.get('/admin/categories', user.can('access admin page'), categories.findRoot);
    
  
  /****
   * API routes!
   *  The routes below are all for use by the API.
   ****/
  // Add a new category
  app.post('/api/categories', user.can('access public page'), categories.create);
  
  // Retrieve all top-level categories
  app.get('/api/categories', user.can('access public page'), categories.findRoot);
  
  // Retrieve a given category and its children
  app.get('/api/categories/:categoryId', user.can('access public page'), categories.findOne);
  
  // Update a given category
  app.put('/api/categories/:categoryId', user.can('access admin page'), categories.update);
  
  app.put('/api/categories/:categoryId/childorder', user.can('access public page'), categories.sortChildren);
  
  // Delete a given category -- should this also delete any attached children
  //    **and any attached posts? **
  app.delete('/api/categories/:categoryId', user.can('access admin page'), categories.delete)
}