const

  openMonth = (e, month) => {
    const year = byId("filter--year").value;
    const bank = byId("filter--bank").value;
    document.location.href=`/invoices/${year}${month}?b=${bank}`;
  },

  componentInvoices = () => {
    
    const
      template = byId("template-row-invoice"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),      
      idFieldElement = byId("field--id"),
      errorElements = byAll("span.textfield__error"),

      monthFilterElement = byId("filter--month"),
      yearFilterElement = byId("filter--year"),
      bankFilterElement = byId("filter--bank"),
      /*
      typeFieldElement = byName("field--type"),
      typeErrorElement = errorElements[0],
      */
      historyFieldElement = byId("field--history"),
      historyErrorElement = errorElements[0],
      forecastFieldElement = byId("field--forecast"),
      confirmationFieldElement = byId("field--confirmation"),
      valueErrorElement = errorElements[1],
      expectedValueFieldElement = byId("field--expected-value"),
      confirmedValueFieldElement = byId("field--confirmed-value"),
      dateErrorElement = errorElements[2],
      bankFieldElement = byId("field--bank"),
      bankListElement = byId("datalist--bank"),
      bankErrorElement = errorElements[3],
      cardListElement = byId("datalist--card"),
      categoryFieldElement = byId("field--category"),
      categoryListElement = byId("datalist--category"),
      categoryErrorElement = errorElements[4],
      
      addElement = byId("btn--add"),
      saveElement = byId("btn--save"),
      deleteElement = byId("btn--delete"),
      resetElement = byId("btn--reset"),
      rowActive = new ActiveElement("is-active"),

      read = (year, month, bank_id) =>  {

        getInvoicesByYearMonth(year, month, bank_id)
          .then(getResult)
          .then(async result => {
            tbodyElement.innerHTML = "";
            return result;
          })
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
            console.error(error);
          });
/*
        getCards()
          .then(getResult)
          .then(renderCardListView)
          .catch(function(error) {
            console.error(error);
          });
*/
        getInvoicesOverview(year, month, bank_id)
          .then(getResult)
          .then(async result => {
            const { despesa, receita, saldo } = result.payload;
            byId("value--d").textContent = toCurrency(despesa);
            byId("value--r").textContent = toCurrency(receita);
            byId("value--s").textContent = toCurrency(saldo);
            byId("value--s").classList.toggle("text--danger", saldo < 0);
            byId("value--s").classList.toggle("text--primary", saldo > 0);

          })
          .catch(function(error) {
            console.error(error);
          })

      },

      toCurrency = value => 
        value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }) 
      ,

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
            return read(yearFilterElement.value, monthFilterElement.value);
            //return { ...result, payload: [result.payload]}
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
            //removeItemView(id);
            return read(yearFilterElement.value, monthFilterElement.value);
          })
          .then(renderListView)
          .catch(function(error) {
            console.log(error);
          })
      },

      savePayment = element => {
        const data = JSON.parse(byParent("tr", element).dataset.data);
        const confirmed = element.checked;
        data.confirmed_value = confirmed ? data.expected_value : "";
        data.confirmation_date = confirmed ? (new Date()).getTime() : "";
        update(data);
      },

      getItemView = id => {
        return byId(id) || bySelector("tr", template.content.cloneNode(true));
      },

      bindItemView = ({history, forecast_date, confirmation_date, expected_value, confirmation_value, bank, category}, element) => {
        const elements = byAll("td", element);

        //bySelector("input", elements.item(0)).checked = confirmation_date && confirmation_date.toString().length > 0;
        elements.item(0).textContent = formatDateBR(fromDate(forecast_date));
        elements.item(1).textContent = formatDateBR(fromDate(confirmation_date));
        elements.item(2).textContent = history;
        elements.item(3).textContent = toCurrency(expected_value);
        elements.item(4).textContent = category.category;
        
        if(category.type === "D")
          elements.item(4).classList.add("text--danger");
        else if(category.type === "R")
          elements.item(4).classList.add("text--success");

        elements.item(5).textContent = bank.name;
        return element;
      },

      renderResetView = () => {
        rowActive.toggle(null);
        deleteElement.classList.add("hide");
/*
        for(typeOptionElement of typeFieldElement)
          typeOptionElement.checked = false;
*/        
        idFieldElement.value = "";
        historyFieldElement.value = "";
        forecastFieldElement.value = "";
        confirmationFieldElement.value = "";
        expectedValueFieldElement.value = "";
        confirmedValueFieldElement.value = "";
        bankFieldElement.value = "";
        categoryFieldElement.value = "";
        renderResetErrorView();
      },

      renderResetErrorView = () => {
        for(element of errorElements) {
          element.style.display = "none";
          element.textContent = "";
        }
      },

      removeItemView = id => {
        const element = getItemView(id);
        element.remove();
      }, 

      renderItemView = data => { 
        const { id, confirmation_date, forecast_date } = data;
        const element = getItemView(id);

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

        if(element.hasChildNodes())
          return;

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

        renderDataView(bankListElement, result.payload.filter(({type}) => type === "D"), "name");
      },

      renderCardListView = result => {
        if(result.status.toString().trim() !== "1")
          return;

        renderDataView(cardListElement, result.payload, "name");
      },

      renderEditView = invoice => {
        
        const { 
          id,
          history,
          forecast_date,
          confirmation_date,
          expected_value,
          confirmed_value,
          bank,
          category
        } = invoice;

        /*
        console.log(toDate(forecast_date));
        const date_forecast = new Date(forecast_date);
        console.log(date_forecast);
        
        for(element of typeFieldElement) {
          element.checked = element.value === bank.type;
          if(element.checked) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            element.dispatchEvent(evt);
          }
            
        }*/

        idFieldElement.value = id;
        historyFieldElement.value = history;
        expectedValueFieldElement.value = parseFloat(expected_value).toFixed(2);
        confirmedValueFieldElement.value = confirmed_value && confirmed_value.toString().trim().length 
          ? parseFloat(confirmed_value).toFixed(2) 
          : ""
        ;
        forecastFieldElement.value = formatDate(fromDate(forecast_date)) ;
        confirmationFieldElement.value = confirmation_date && confirmation_date > 0
          ? formatDate(fromDate(confirmation_date))
          : ""
        ;
        bankFieldElement.value = bank.name;
        categoryFieldElement.value = category.category;
        historyFieldElement.select();
      },
     
      renderSelectView = element => {
        rowActive.toggle(element);
        deleteElement.classList.remove("hide");
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
        historyFieldElement.focus();
      },

      handleActive = e => {
        const element = e.target;

        switch(element.nodeName) {
          case "TD":
            e.preventDefault();
            renderSelectView(element.parentNode);
            return;
          case "INPUT":
            savePayment(element);
            return;
        }
      },

      handleDelete = e => {
        e.preventDefault();
        const id = idFieldElement.value.toString().trim();
        if(id.length && id !== "0")
          remove(id);
      },

      handleChange = e => {
        const element = e.target;  
        //bankFieldElement.setAttribute("list", element.dataset.list);
      },

      handleSave = e => {

        renderResetErrorView();

        let send = true;

        /*
        let checked = false;
        console.log(typeFieldElement);
        for(element of typeFieldElement) {
          checked = !checked && element.checked ? true : false;
        }
        */

        /*
        if(!checked) {
          send = false;
          typeErrorElement.innerHTML = "Por favor, informe um tipo para seu movimento.";
          typeErrorElement.style.display = "block";
        }
        */

        if(!historyFieldElement.value.toString().trim().length) {
          send = false;
          historyErrorElement.innerHTML = "Por favor, informe um hist&#243;rico v&#225;lido";
          historyErrorElement.style.display = "block";
        }

        if(!expectedValueFieldElement.value.toString().trim().length) {
          send = false;
          valueErrorElement.innerHTML = "Por favor, informe um valor previsto.";
          valueErrorElement.style.display = "block";
        }

        if(!forecastFieldElement.value.toString().trim().length) {
          send = false;
          dateErrorElement.innerHTML = "Por favor, informe uma data de previs&#227o.";
          dateErrorElement.style.display = "block";
        }

        const bankId = getOptionSelected(byId(bankFieldElement.getAttribute("list")), bankFieldElement.value);
        if(!bankId) {
          send = false;
          bankErrorElement.innerHTML = "Por favor informe uma conta v&#225;lida.";
          bankErrorElement.style.display = "block";
        }

        const categoryId = getOptionSelected(categoryListElement, categoryFieldElement.value);
        if(!categoryId) {
          send = false;
          categoryErrorElement.innerHTML = "Por favor informe uma categoria v&#225;lida.";
          categoryErrorElement.style.display = "block";
        }

        if(!send) {
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
        const bank = bankFilterElement.value;
        document.location.href=`/invoices/${year}${month}?b=${bank}`;
      },
      
      handleMask = e => {
        e.target.value = maskCurrency(e.target.value);
      },

      handlePress = e => {
        onlyCurrencyDigits(e);
      },

      handleFocus = e => {
        e.target.value = initCurrency(e.target.value);
      }
    ;

    confirmedValueFieldElement.addEventListener("focus", handleFocus);
    confirmedValueFieldElement.addEventListener("keypress", handlePress);
    confirmedValueFieldElement.addEventListener("keyup", handleMask);
    expectedValueFieldElement.addEventListener("focus", handleFocus);
    expectedValueFieldElement.addEventListener("keypress", handlePress);
    expectedValueFieldElement.addEventListener("keyup", handleMask);

    addElement.addEventListener("click", handleAdd);
    tbodyElement.addEventListener("click", handleActive);
    saveElement.addEventListener("click", handleSave);
    deleteElement.addEventListener("click", handleDelete);
    resetElement.addEventListener("click", handleReset);
    yearFilterElement.addEventListener("change", handleFilter);
    monthFilterElement.addEventListener("change", handleFilter);
    bankFilterElement.addEventListener("change", handleFilter);
    
    /*
    for(typeOptionElement of typeFieldElement)
      typeOptionElement.addEventListener("change", handleChange);
    */

    read(yearFilterElement.value, monthFilterElement.value, bankFilterElement.value);

  }

;
