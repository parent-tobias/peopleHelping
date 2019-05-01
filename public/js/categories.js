fetch('/api/categories')
  .then(response => response.json() )
  .then(RootCategory => {
  /****
   * So here, we have a root category -- let's also get its children
   ****/
    let rootNode = new Category(RootCategory);
    document.querySelector('section').appendChild(rootNode.domEl);
  
    let promises = RootCategory.children.map(childCategory => {
      return fetch(childCategory.url)
        .then(response => response.json() )
        .then(childCategory =>{ return childCategory } )
    });

  Promise.all(promises).then( childNodes => {
    childNodes.forEach(childNode =>{
      let childCategory = new Category(childNode)
      rootNode.addChild(childCategory);
    })  
  })
  });