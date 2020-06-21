const
  
  componentCategorias = () => {
    
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
        for(item of result.payload)
          fragment.appendChild(renderItemView(item))

        tbodyElement.appendChild(fragment);
      }
    ;

    getCategorias()
      .then(getResult)
      .then(renderListView)
      .then(function(error) {
        console.error(error);
      });
  }

;
