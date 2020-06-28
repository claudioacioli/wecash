const

  componentInvoices = () => {
    
    const
      template = byId("template-row-invoice"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),      
      idFieldElement = byId("field--id"),
      
      monthFilterElement = byId("filter--month"),
      yearFilterElement = byId("filter--year"),

      historyFieldElement = byId("field--history"),
      forecastFieldElement = byId("field--forecast"),
      confirmationFieldElement = byId("field--confirmation"),
      expectedValueFieldElement = byId("field--expected-value"),
      confirmedValueFieldElement = byId("field--confirmed-value"),
      bankFieldElement = byId("field--bank"),
      bankListElement = byId("datalist--bank"),
      categoryFieldElement = byId("field--category"),
      categoryListElement = byId("datalist--category"),
      addElement = byId("btn--add"),
      saveElement = byId("btn--save"),
      deleteElement = byId("btn--delete"),
      resetElement = byId("btn--reset"),
      rowActive = new ActiveElement("is-active"),

      read = (year, month) =>  {

        getInvoicesByYearMonth(year, month)
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

      create = data => {
        postInvoices(data)
          .then(getResult)
          .then(async result => {
            renderResetView();
            return read(yearFilterElement.value, monthFilterElement.value);
            //return { ...result, payload: [result.payload]}
          })
          .then(renderListView)
          .catch(function(error) {
            console.log(error);
          });
      },

      update = data => {
        putInvoices(data)
          .then(getResult)
          .then(async result => {
            renderResetView();
            return { ...result, payload: [result.payload]}
          })
          .then(renderListView)
          .catch(function(error) {
            console.log(error);
          });
      },

      remove = id => {
        deleteInvoices(id)
          .then(getResult)
          .then(() => {
            renderResetView();
            removeItemView(id);
          })
          .catch(function(error) {
            console.log(error);
          })
      },

      getItemView = id => {
        return byId(id) || bySelector("tr", template.content.cloneNode(true));
      },

      bindItemView = ({history, forecast_date, confirmation_date, expected_value, confirmation_value, bank, category}, element) => {
        const elements = byAll("td", element);

        bySelector("input", elements[0]).checked = confirmation_date && confirmation_date.toString().length > 0;
        elements[1].textContent = formatDateBR(fromDate(forecast_date));
        elements[2].textContent = formatDateBR(fromDate(confirmation_date));
        elements[3].textContent = history;
        elements[4].textContent = expected_value;
        elements[5].textContent = category.category;
        elements[6].textContent = bank.bank;
        return element;
      },

      renderResetView = () => {
        rowActive.toggle(null);
        idFieldElement.value = "";
        historyFieldElement.value = "";
        forecastFieldElement.value = "";
        confirmationFieldElement.value = "";
        expectedValueFieldElement.value = "";
        confirmedValueFieldElement.value = "";
        bankFieldElement.value = "";
        categoryFieldElement.value = "";
      },

      removeItemView = id => {
        const element = getItemView(id);
        element.remove();
      }, 

      renderItemView = data => { 
        const { id, confirmation_date, forecast_date } = data;
        const element = getItemView(id);

        console.log(confirmation_date);
        if(confirmation_date && confirmation_date > 0)
          element.classList.add("is-confirmed");

        if(forecast_date < (new Date()).getTime() 
          && (!confirmation_date || confirmation_date < 0))
          element.classList.add("is-pendent");

        element.id = id;
        element.dataset.data = JSON.stringify(data);

        return bindItemView(data, element);
      },

      renderListView = result => {
        const fragment = document.createDocumentFragment();
        const data = result.payload;
        for(item of data) 
          fragment.appendChild(renderItemView(item));

        tbodyElement.appendChild(fragment);
      },

      renderOptionView = (item, prop) => {
        const element = document.createElement("option");
        element.value = item[prop];
        element.dataset.data = JSON.stringify(item);
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

        renderDataView(bankListElement, result.payload, "name");
      },

      renderEditView = ({id, history, forecast_date, confirmation_date, expected_value, confirmed_value, bank, category}) => {
        
        fromDate(forecast_date);

        idFieldElement.value = id;
        historyFieldElement.value = history;
        forecastFieldElement.value = formatDate(fromDate(forecast_date));
        confirmationFieldElement.value = formatDate(fromDate(confirmation_date));
        expectedValueFieldElement.value = expected_value;
        confirmedValueFieldElement.value = confirmed_value;
        bankFieldElement.value = bank.bank;
        categoryFieldElement.value = category.category;
      },
     
      renderSelectView = element => {
        rowActive.toggle(element);
        renderEditView(JSON.parse(element.dataset.data));
      },

      getOptionSelected = (parent, value) => {
        const element = bySelector(`option[value="${value}"]`, parent);
        if(!element)
          return null;

        return JSON.parse(element.dataset.data).id;
      },

      handleAdd = (e) => {
        e.preventDefault();
        renderResetView();
      },

      handleActive = e => {
        const element = e.target;
        if(element.nodeName === "TD") {
          e.preventDefault();
          renderSelectView(element.parentNode)
        }
      },

      handleDelete = e => {
        e.preventDefault();
        const id = idFieldElement.value.toString().trim();
        if(id.length && id !== "0")
          remove(id);
      },

      handleSave = e => {

        const bankId = getOptionSelected(bankListElement, bankFieldElement.value);
        if(!bankId) {
          bankFieldElement.focus();
          alert("Informe uma conta");
          return;
        }

        const categoryId = getOptionSelected(categoryListElement, categoryFieldElement.value);
        if(!categoryId) {
          categoryFieldElement.focus();
          alert("Informe uma categoria");
          return;
        }

        const data = {
          "id": idFieldElement.value,
          "history": historyFieldElement.value,
          "forecast_date": toTime(forecastFieldElement.value),
          "confirmation_date": toTime(confirmationFieldElement.value),
          "expected_value": expectedValueFieldElement.value,
          "confirmed_value": confirmedValueFieldElement.value,
          "bank_id": bankId,
          "category_id": categoryId
        };

        if(data.id === "0" || data.id === "") 
          create(data);
        else
          update(data);
      },

      handleReset = e => {
        e.preventDefault();
        renderResetView();
      },

      handleFilter = e => {
        const year = yearFilterElement.value;
        const month = monthFilterElement.value;
        document.location.href=`/invoices/${year}${month}`;
      }
    ;

    addElement.addEventListener("click", handleAdd);
    tbodyElement.addEventListener("click", handleActive);
    saveElement.addEventListener("click", handleSave);
    deleteElement.addEventListener("click", handleDelete);
    resetElement.addEventListener("click", handleReset);
    yearFilterElement.addEventListener("change", handleFilter);
    monthFilterElement.addEventListener("change", handleFilter);

    read(yearFilterElement.value, monthFilterElement.value);

  }

;
