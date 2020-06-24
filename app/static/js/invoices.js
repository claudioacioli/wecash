const

  componentInvoices = () => {
    
    const
      template = byId("template-row-invoice"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),

      

      bindItemView = ({historico, previsao, previsto, categoria, conta}, element) => {
        const elements = byAll("td", element);
        elements[1].textContent = previsao;
        elements[2].textContent = "";
        elements[3].textContent = historico;
        elements[4].textContent = previsto;
        elements[5].textContent = categoria;
        elements[6].textContent = conta;
        return element;
      },

      renderItemView = item => 
        bindItemView(item, template.content.cloneNode(true))
      ,

      renderListView = result => {
        const fragment = document.createDocumentFragment();
        const { invoices } = result.payload;
        for(invoice of invoices) 
          fragment.appendChild(renderItemView(invoice));

        tbodyElement.appendChild(fragment);
      }
    ;

    getInvoices()
      .then(getResult)
      .then(renderListView)
      .catch(function(error) {
        console.error(error);
      })
  }

;
