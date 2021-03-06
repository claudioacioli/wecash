const
  
  componentCards = () => { 
    
    const 
      template = byId("template-row-card"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),
      idFieldElement = byId("field--id"),
      nameFieldElement = byId("field--name"),
      dayFieldElement = byId("field--day"),
      limitDayFieldElement = byId("field--pay"),
      limitFieldElement = byId("field--limit"),
      goalFieldElement = byId("field--goal"),
      saveButtonElement = byId("btn--save"),
      addButtonElement = byId("btn--add"),
      resetElement = byId("btn--reset"),
      deleteButtonElement = byId("btn--delete"),
      rowActive = new ActiveElement("is-active")

      read = () => {
        getCards()
          .then(getResult)
          .then(renderListView)
          .catch(function(error) {
            console.error(error);
          });
      },

      create = data => {
        postCards(data)
          .then(getResult)
          .then(async result => {
            renderResetView();
            return { ...result, payload: [result.payload]}
          })
          .then(renderListView)
          .catch(function(error) {
            console.error(error);
          })
      },

      edit = data => {
        putCards(data)
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
        deleteCards(id)
          .then(getResult)
          .then(() => {
            renderResetView();
            removeItemView(id);
          })
          .catch(function(error) {
            console.log(error);
          });
      },

      getItemView = id => {
        return byId(id) || bySelector("tr", template.content.cloneNode(true));
      },

      bindItemView = ({ name, day, limit_value, limit_day, goal}, element) => {
        const elements = byAll("td", element);
        elements.item(0).textContent = name;
        elements.item(1).textContent = day;
        elements.item(2).textContent = limit_value;
        elements.item(3).textContent = goal;
        return element;
      },

      removeItemView = id => {
        const element = getItemView(id);
        element.remove();
      },

      renderItemView = data => {
        const { id } = data;
        const element = getItemView(id);
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

      renderResetView = () => {
        idFieldElement.value = "";
        nameFieldElement.value = "";
        limitFieldElement.value = "";
        limitDayFieldElement.value = "";
        dayFieldElement.value = "";
        goalFieldElement.value = "";
        rowActive.toggle(null);
      },

      renderEditView = data => {
        const { id, name, limit_value, goal, day, limit_day } = data;
        idFieldElement.value = id;
        nameFieldElement.value = name;
        limitFieldElement.value = limit_value;
        limitDayFieldElement.value = limit_day;
        dayFieldElement.value = day;
        goalFieldElement.value = goal;
      },

      renderSelectView = element => {
        rowActive.toggle(element);
        renderEditView(JSON.parse(element.dataset.data));
      },

      handleAdd = (e) => {
        e.preventDefault();
        renderResetView();
      },

      handleDelete = e => {
        e.preventDefault();
        const id = idFieldElement.value.toString().trim();
        if(id.length && id !== "0")
          remove(id);
      },

      handleActive = e => {
        const element = e.target;
        if(element.nodeName === "TD") {
          e.preventDefault();
          renderSelectView(element.parentNode);
        }
      },

      handleReset = e => {
        e.preventDefault();
        renderResetView();
      },

      handleSave = () => {
        const data = {
          "id": idFieldElement.value.toString().trim(),
          "card": nameFieldElement.value,
          "limit_value": limitFieldElement.value,
          "limit_day": limitDayFieldElement.value,
          "goal": goalFieldElement.value,
          "day": dayFieldElement.value
        };

        if(data.id === "0" || data.id === "")
          create(data);
        else
          edit(data);        
      }
    ;

    addButtonElement.addEventListener("click", handleAdd);
    tbodyElement.addEventListener("click", handleActive);
    saveButtonElement.addEventListener("click", handleSave);
    deleteButtonElement.addEventListener("click", handleDelete);
    resetElement.addEventListener("click", handleReset);

    read();

  }

;
