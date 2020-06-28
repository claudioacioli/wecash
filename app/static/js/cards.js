const
  
  componentCards = () => { 
    
    const 
      template = byId("template-row-card"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),
      idFieldElement = byId("field--id"),
      nameFieldElement = byId("field--name"),
      dayFieldElement = byId("field--day"),
      limitFieldElement = byId("field--limit"),
      goalFieldElement = byId("field--goal"),
      saveButtonElement = byId("btn--save"),
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
            return { ...result, payload: [result.payload]}
          })
          .then(renderListView)
          .catch(function(error) {
            console.error(error);
          })
      },

      getItemView = id => {
        return byId(id) || bySelector("tr", template.content.cloneNode(true));
      },

      bindItemView = ({ name, day, limit_value, goal}, element) => {
        const elements = byAll("td", element);
        elements[1].textContent = name;
        elements[2].textContent = day;
        elements[3].textContent = limit_value;
        elements[4].textContent = goal;
        return element;
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

      renderSelectView = element => {
        rowActive.toggle(element);
      },

      handleActive = e => {
        const element = e.target;
        if(element.nodeName === "TD") {
          e.preventDefault();
          renderSelectView(element.parentNode);
        }
      },

      handleSave = () => {
        const data = {
          "id": idFieldElement.value.toString().trim(),
          "card": nameFieldElement.value,
          "limit_value": limitFieldElement.value,
          "goal": goalFieldElement.value,
          "day": dayFieldElement.value
        };

        if(data.id === "0" || data.id === "")
          create(data);
        
      }
    ;

    tbodyElement.addEventListener("click", handleActive);
    saveButtonElement.addEventListener("click", handleSave);

    read();

  }

;
