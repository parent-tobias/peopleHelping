class Category{
  constructor(props){
    /****
     *
     * props is an object being passed in. At this point, the object 
     * will contain the data we're fetching from the API.
     *
     ****/
    let populateDomEl = () => {
      console.log(this._state);
      if(typeof this._state.title !== undefined && this._state.title !== ""){
        let titleEl = document.createElement('h2');
        titleEl.classList.add("category-title");
        titleEl.textContent = this._state.title;
        this._domEl.appendChild(titleEl);
      }
      if(typeof this._state.description !== undefined && this._state.description !== ""){
        let descEl = document.createElement('p');
        descEl.classList.add("category-description");
        descEl.textContent = this._state.description;
        this._domEl.appendChild(descEl);
      }
      if(typeof this._state.children !== undefined && this._state.children.length > 0){
        let subcatEl = document.createElement('article');
        subcatEl.classList.add('category-children');
        this._domEl.appendChild(subcatEl);
      }
    }

    this._state = props;
    this._state.childNodes = [];
    this._domEl = document.createElement("section");
    this._domEl.classList.add("category");
    
    populateDomEl();
    
  }
  
  get domEl(){
    return this._domEl;
  }
  
  get title(){
    return this._state.title;
  }
  set title(title){
    this._state.title = title;
    return this;
  }
  
  get description(){
    return this._state.description;
  }
  
  set description(description){
    this._state.description = description;
    return this;
  }
  addChild(childCategory){
    this._state.childNodes.push(childCategory);
    this._domEl.querySelector('.category-children').appendChild(childCategory.domEl);
  }
}