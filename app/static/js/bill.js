const

  componentBill = () => {
    
    const 
      template = byId("template-row-bill"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),      
      monthFilterElement = byId("filter--month"),
      yearFilterElement = byId("filter--year"),
      errorElements = byAll("span.textfield__error"),
      cardFieldElement = byId("field--card"),
      cardListElement = byId("datalist--card");
      cardErrorElement = errorElements.item(0),
      
      categoryFieldElement = byId("field--category"),
      categoryListElement = byId("datalist--category"),
      categoryErrorElement = errorElements.item(1),

      historyFieldElement = byId("field--history"),
      historyErrorElement = errorElements.item(4), 
      valueFieldElement = byId("field--value"),
      valueErrorElement = errorElements.item(2),
      dateFieldElement = byId("field--date"),
      dateErrorElement = errorElements.item(3)
      saveElement = byId("btn--save"),

      read = async (year, month) => {
        const result = await getBills(year, month);
        console.log(result);
        renderListView(result);
      },

      toCurrency = value => 
        value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      ,
      
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

      renderResetErrorView = () => {
        for(element of errorElements) {
          element.style.display = "none";
          element.textContent = "";
        }
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
      }
    ;

    saveElement.addEventListener("click", handleSave);

    read(yearFilterElement.value, monthFilterElement.value);
  }
;
