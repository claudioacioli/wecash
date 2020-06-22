const
  
  componentCategories = () => {
    
    const 
      template = byId("template-row-category"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),

      setBookmark = (element, type) => {
        if(type === "D")
          element.classList.replace("bookmark--success", "bookmark--danger");
        else
          element.classList.add("bookmark--danger", "bookmark--success");
      },

      bindItemView = ({category, type, go}, element) => {
        const elements = byAll("td", element);
        elements[1].textContent = category;
        elements[2].textContent = go;
        setBookmark(bySelector("tr", element), type); 
        return element;
      },

      renderItemView = item => {
        return bindItemView(item, template.content.cloneNode(true));
      },

      renderListView = result => {
        const fragment = document.createDocumentFragment();
        const { categories } = result.payload;

        for(category of categories)
          fragment.appendChild(renderItemView(category))
        
        tbodyElement.appendChild(fragment);
      }
    ;

    getCategories()
      .then(getResult)
      .then(renderListView)
      .catch(function(error) {
        console.error(error);
      });
  }

;
