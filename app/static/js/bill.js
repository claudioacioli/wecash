const

  componentBill = () => {
    
    const 
      template = byId("template-row-bill"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),      
      yearFilterElement = byId("filter--year"),
      idFieldElement = byId("field--id"),
      errorElements = byAll("span.textfield__error"),
      cardFieldElement = byId("field--card"),
      cardListElement = byId("datalist--card"),
      cardErrorElement = errorElements.item(0),      
      categoryFieldElement = byId("field--category"),
      categoryListElement = byId("datalist--category"),
      categoryErrorElement = errorElements.item(1),
      historyFieldElement = byId("field--history"),
      historyErrorElement = errorElements.item(4), 
      valueFieldElement = byId("field--value"),
      valueErrorElement = errorElements.item(2),
      dateFieldElement = byId("field--date"),
      dateErrorElement = errorElements.item(3),
      addElement = byId("btn--add"),
      saveElement = byId("btn--save"),
      resetElement = byId("btn--reset"),
      deleteElement = byId("btn--delete"),
      tabElement = byId("tab--months"),

      rowActive = new ActiveElement("is-active"),

      currentMonth = byAll("button.selected", tabElement).item(0).dataset.value,

      read = async (year, month) => {

        try {
          const cards = await getCards();
          renderCardListView(cards);
        } catch (err) {
          alert(err.message);
        }

        try {
          const categories = await getCategories("D");
          renderCategoryListView(categories);
        }catch (err) {
          console.error(err);
          alert(err.message);
        }
        
        try {
          const result = await getBills(year, month);
          console.log(result);
          tbodyElement.innerHTML = "";
          renderListView(result);
        } catch (err) {
          console.error(err);
          alert(err.message);
        }
      },
      
      create = async data => {
        renderLoaderView(saveElement, true);
        try {
          const result = await postInvoices(data);
          await getResult(result);
          renderResetView();
          readHelper();
        } catch (err) {
          console.error(err);
          alert(err.message);
        }
        renderLoaderView(saveElement, false);
      },

      update = async data => {
        renderLoaderView(saveElement, true);
        try {
          const result = await putInvoices(data);
          await getResult(result);
          renderResetView();
          readHelper();
        } catch (err) { 
          console.error(err);
          alert(err.message);
        }
        renderLoaderView(saveElement, false);
      },

      remove = async id => {
        renderLoaderView(deleteElement, true);
        try {
          const result = await deleteInvoices(id);
          await getResult(result);
          renderResetView();
          readHelper();
        } catch (err) {
          console.error(err);
          alert(err);
        }
        renderLoaderView(deleteElement, false);
      },

      redirect = (year, month) => {
        document.location.href=`/bill/${year}${month}`;
      },

      readHelper = () => {
        read(
          yearFilterElement.value, 
          byAll("button.selected", tabElement).item(0).dataset.value
        );
      },

      toCurrency = value => 
        value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      ,
      
      renderLoaderView = (element, loading) => {
        if(loading) {
          element.classList.toggle("submitting");
          element.disabled = true;
        } else {
          element.classList.toggle("submitting");
          element.disabled = false;
        }
      },
     
      renderResetView = () => {
        rowActive.toggle(null);
        deleteElement.classList.add("hide");
        
        idFieldElement.value = "";
        historyFieldElement.value = "";
        dateFieldElement.value = "";
        valueFieldElement.value = "";
        cardFieldElement.value = "";
        categoryFieldElement.value = "";
        renderResetErrorView();
      },

      getOptionSelected = (parent, value) => {
        const element = bySelector(`option[value="${value}"]`, parent);
        if(!element)
          return null;

        return JSON.parse(element.dataset.data).id;
      },

      getItemView = (id, t = template) => {
        return byId(id) || bySelector("tr", t.content.cloneNode(true));
      },

      bindItemView = ({history, confirmation_date, confirmed_value, bank, category}, element) => {
        const elements = byAll("td", element);

        elements.item(0).textContent = bank.name;
        elements.item(1).textContent = toCurrency(confirmed_value);
        elements.item(2).textContent = formatDateBR(fromDate(confirmation_date));
        elements.item(3).textContent = category.category;
        elements.item(4).textContent = history;

        return element;
      },

      renderItemView = data => { 
        
        const { id } = data;
        const element = getItemView(id);

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() -1);
        
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
      
      renderEditView = data => {
        
        const { 
          id,
          history,
          forecast_date,
          confirmation_date,
          expected_value,
          confirmed_value,
          bank,
          category
        } = data;

        idFieldElement.value = id;
        historyFieldElement.value = history;
        valueFieldElement.value = parseFloat(confirmed_value).toFixed(2);
        dateFieldElement.value = formatDate(fromDate(confirmation_date)) ;
        cardFieldElement.value = bank.name;
        categoryFieldElement.value = category.category;
        valueFieldElement.select();

      },

      renderSelectView = element => {
        renderResetErrorView();
        rowActive.toggle(element);
        deleteElement.classList.remove("hide");
        renderEditView(JSON.parse(element.dataset.data));
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

      renderCardListView = result => {
        if(result.status.toString().trim() !== "1")
          return;

        renderDataView(cardListElement, result.payload, "name");
      },
      
      renderCategoryListView = result => {
        if(result.status.toString().trim() !== "1")
          return;

        renderDataView(categoryListElement, result.payload, "category");
      },

      renderResetErrorView = () => {
        for(element of errorElements) {
          element.style.display = "none";
          element.textContent = "";
        }
      },
     
      handleAdd = (e) => {
        e.preventDefault();
        renderResetView();
        historyFieldElement.focus();
      },

      handleFilter = e => {
        const year = e.target.value;
        const month = byAll("button.selected", tabElement).item(0).dataset.value;
        redirect(year, month);
      },

      handleActive = e => {
        const element = e.target;

        switch(element.nodeName) {
          case "TD":
            e.preventDefault();
            renderSelectView(element.parentNode);
            return;
        }
      },

      handleMonth = e => {
        const element = e.target;
        switch(element.nodeName) {
          case "BUTTON":
            e.preventDefault();
            const year = yearFilterElement.value;
            const month = element.dataset.value;
            redirect(year, month);
            return;
        }
      },

      handleDelete = e => {
        e.preventDefault();
        console.log("chegou aqui");
        const id = idFieldElement.value.toString().trim();
        if(id.length 
          && id !== "0"
          && confirm("Tem ceteza que deseja excluir esse lancamento?"))
          remove(id);
      },
     
      handleReset = e => {
        e.preventDefault();
        renderResetView();
      },

      handleSave = e => {
        renderResetErrorView();
        
        let send = true;

        if(!historyFieldElement.value.toString().trim().length) {
          send = false;
          historyErrorElement.innerHTML = "Por favor, informe um hist&#243;rico v&#225;lido";
          historyErrorElement.style.display = "block";
        }

        if(!valueFieldElement.value.toString().trim().length) {
          send = false;
          valueErrorElement.innerHTML = "Por favor, informe um valor previsto.";
          valueErrorElement.style.display = "block";
        }

        if(!dateFieldElement.value.toString().trim().length) {
          send = false;
          dateErrorElement.innerHTML = "Por favor, informe uma data de previs&#227o.";
          dateErrorElement.style.display = "block";
        }

        const cardId = getOptionSelected(cardListElement, cardFieldElement.value);
        if(!cardId) {
          send = false;
          cardErrorElement.innerHTML = "Por favor informe um cart&#227;o v&#225;lida.";
          cardErrorElement.style.display = "block";
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
          "forecast_date": toTime(dateFieldElement.value),
          "confirmation_date": toTime(dateFieldElement.value),
          "expected_value": valueFieldElement.value,
          "confirmed_value": valueFieldElement.value,
          "bank_id": cardId,
          "category_id": categoryId
        };
        
        console.log(data);

        if(data.id === "0" || data.id === "") 
          create(data);
        else
          update(data);
      }
    ;

    addElement.addEventListener("click", handleAdd);
    tbodyElement.addEventListener("click", handleActive);
    deleteElement.addEventListener("click", handleDelete);
    resetElement.addEventListener("click", handleReset);
    saveElement.addEventListener("click", handleSave);
    tabElement.addEventListener("click", handleMonth);
    yearFilterElement.addEventListener("change", handleFilter);
    
    readHelper();
  }
;
