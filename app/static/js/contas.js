const
  
  componentContas = () => {
    
    const
      template = byId("template-row-bank"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),

      bindItemView = ({conta, saldo}, element) => {
        const elements = byAll("td", element);
        elements[1].textContent = conta;
        elements[2].textContent = saldo;
        return element;
      },

      renderItemView = item => {
        return bindItemView(item, template.content.cloneNode(true));
      },

      renderListView = result => {
        const fragment = document.createDocumentFragment();
        for(item of result.payload)
          fragment.appendChild(renderItemView(item));

        tbodyElement.appendChild(fragment);
      }
    ;

    getContas()
      .then(getResult)
      .then(renderListView)
      .catch(function(error) {
        console.error(error);
      });
  }

;
