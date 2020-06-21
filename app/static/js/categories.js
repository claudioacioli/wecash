const
  
  componentCategories = () => {
    
    const 
      template = byId("template-row-category"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),

      bindItemView = ({categoria, tipo, meta}, element) => {
        const elements = byAll("td", element);
        elements[1].textContent = categoria;
        elements[2].textContent = tipo;
        elements[3].textContent = meta;
        elements[4].textContent = "R$ 0,00";
        elements[5].textContent = "R$ 0,00";
        return element;
      },

      renderItemView = item => {
        return bindItemView(item, template.content.cloneNode(true));
      },

      renderListView = result => {
        const fragment = document.createDocumentFragment();
        console.log(result);
        const { categories } = result.payload;
        console.log(categories);
        for(category of categories)
          fragment.appendChild(renderItemView(category))
        console.log("here");
        tbodyElement.appendChild(fragment);
      }
    ;

    getCategories()
      .then(getResult)
      .then(renderListView)
      .then(function(error) {
        console.error(error);
      });
  }

;
