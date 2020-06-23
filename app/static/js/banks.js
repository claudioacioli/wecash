const
  
  componentBanks = () => {
    
    const
      template = byId("template-row-bank"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),
      inputElement = byId("input--bank"),
      hiddenElement = byId("input--id"),
      submitElement = byId("btn-bank--submit"),
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
            return { ...result, payload: [result.payload]}
          })
          .then(renderListView)
          .catch(function(error) {
            console.log(error);
          });
      },

      getItemView = id => {
        return byId(id) || bySelector("tr", template.content.cloneNode(true));
      },

      bindItemView = ({bank, value="0,00"}, element) => {
        const elements = byAll("td", element);
        elements[1].textContent = bank;
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
        hiddenElement.value = id;
        inputElement.value = bank;
      },

      renderSelectView = element => {
        rowActive.toggle(element);
        renderEdit(JSON.parse(element.dataset.data));
      },

      handleActive = e => {
        e.preventDefault();
        if(e.target.nodeName === "TD")
          renderSelectView(e.target.parentNode);
      },

      handleAdd = (e) => {
        e.preventDefault();
        renderEditView({"id": 0, "bank": ""});
      },

      handleSubmit = () => {
        const data = {
          "id": hiddenElement.value,
          "bank": inputElement.value,
          "user_id": 1
        };

        if(data.id === "0" || data.id === "")
          create(data);
        else
          edit(data);
      }
    ;

    addElement.addEventListener("click", handleAdd);
    tbodyElement.addEventListener("click", handleActive);
    submitElement.addEventListener("click", handleSubmit);
    
    read();
  }

;
