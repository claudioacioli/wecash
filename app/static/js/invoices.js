const

  componentInvoices = () => {
    
    const
      template = byId("template-row-invoice"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),
      
      idFieldElement = byId("field--id"),
      historyFieldElement = byId("field--history"),
      forecastFieldElement = byId("field--forecast"),
      confirmationFieldElement = byId("field--confirmation"),
      expectedValueFieldElement = byId("field--expected-value"),
      confirmedValueFieldElement = byId("field--confirmed-value"),
      categoryFieldElement = byId("field--bank"),
      bankFieldElement = byId("field--category"),
      bankListElement = byId("datalist--bank"),
      categoryListElement = byId("datalist--category"),

      read = () =>  {

        getInvoices()
          .then(getResult)
          .then(renderListView)
          .catch(function(error) {
            console.error(error);
          });

        getCategories()
          .then(getResult)
          .then(renderCategoryListView)
          .catch(function(error) {
            console.log(error);
          });

        getBanks()
          .then(getResult)
          .then(renderBankListView)
          .catch(function(error) {
            console.log(error);
          });
      },

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
      },

      renderOptionView = (item, prop) => {
        const element = document.createElement("option");
        element.value = item[prop];
        element.dataset.item = JSON.stringify(item);
        return element;
      },

      renderDataView = (element, data, prop) => {
        const fragment = document.createDocumentFragment();

        for(item of data) 
          fragment.appendChild(renderOptionView(item, prop));
        
        element.appendChild(fragment);
      },

      renderCategoryListView = result => {
        if(result.status.toString().trim() !== "1")
          return;

        renderDataView(categoryListElement, result.payload, "category");
      },

      renderBankListView = result => {
        if(result.status.toString().trim() !== "1")
          return;

        renderDataView(bankListElement, result.payload, "bank");
      }
    ;

    read();

  }

;
