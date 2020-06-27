const
  
  componentBanks = () => {
    
    const
      template = byId("template-row-bank"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),
      nameFieldElement = byId("input--bank"),
      idFieldElement = byId("input--id"),
      saveElement = byId("btn--save"),
      deleteElement = byId("btn--delete"),
      resetElement = byId("btn--reset"),
      addElement = byId("btn--add"),
      rowActive = new ActiveElement("is-active"),

      read = () => {
        getBanks()
          .then(getResult)
          .then(renderListView)
          .catch(function(error) {
            console.error(error);
          });
      },

      create = data => {
        postBanks(data)
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

      edit = data => {
        putBanks(data)
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
        deleteBanks(id)
          .then(getResult)
          .then(() => {
            renderResetView();
            removeItemView(id);
          })
          .catch(function(error) {
            console.log(error);
          });
      },

      renderResetView = () => {
        nameFieldElement.value = "";
        idFieldElement.value = "";
        rowActive.toggle(null);
      },

      getItemView = id => {
        return byId(id) || bySelector("tr", template.content.cloneNode(true));
      },

      removeItemView = id => {
        const element = getItemView(id);
        element.remove();
      }, 

      bindItemView = ({name, value="0,00"}, element) => {
        const elements = byAll("td", element);
        elements[1].textContent = name;
        elements[2].textContent = value;
        return element;
      },

      renderItemView = data => {
        const {id} = data;
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

      renderEditView = data => {
        const { id, bank } = data;
        idFieldElement.value = id;
        nameFieldElement.value = bank;
      },

      renderSelectView = element => {
        rowActive.toggle(element);
        renderEditView(JSON.parse(element.dataset.data));
      },

      handleActive = e => {
        e.preventDefault();
        const element = e.target;
        if(element.nodeName === "TD")
          renderSelectView(element.parentNode);
      },

      handleAdd = (e) => {
        e.preventDefault();
        renderResetView();
      },

      handleSave = () => {
        const data = {
          "id": idFieldElement.value,
          "bank": nameFieldElement.value,
          "user_id": 1
        };

        if(data.id === "0" || data.id === "")
          create(data);
        else
          edit(data);
      },

      handleDelete = e => {
        e.preventDefault();
        const id = idFieldElement.value.toString().trim();
        if(id.length && id !== "0")
          remove(id);
      },

      handleReset = e => {
        e.preventDefault();
        renderResetView();
      }
    ;

    addElement.addEventListener("click", handleAdd);
    tbodyElement.addEventListener("click", handleActive);
    saveElement.addEventListener("click", handleSave);
    deleteElement.addEventListener("click", handleDelete);
    resetElement.addEventListener("click", handleReset);
    
    read();
  }

;
