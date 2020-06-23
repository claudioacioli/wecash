const
  
  componentCategories = () => {
    
    const 
      template = byId("template-row-category"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),
      idFieldElement = byId("field--id"),
      nameFieldElement = byId("field--name"),
      typeFieldElement = byId("field--type"),
      goFieldElement = byId("field--go"),
      addElement = byId("btn--add"),
      saveElement = byId("btn--save"),
      deleteElement = byId("btn--delete"),
      rowActive = new ActiveElement("is-active"),

      read = () => {
        getCategories()
          .then(getResult)
          .then(renderListView)
          .catch(function(error) {
            console.error(error);
          });
      },

      create = data => {
        postCategories(data)
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
        putCategories(data)
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
        deleteCategories(id)
          .then(getResult)
          .then(() => {
            renderResetView();
            removeItemView(id);
          })
          .catch(function(error) {
            console.log(error);
          })
      },      

      renderResetView = () => {
        idFieldElement.value = "";
        nameFieldElement.value = "";
        typeFieldElement.value = "D";
        goFieldElement.value = "";
      },

      setBookmark = (element, type) => {
        if(type === "D")
          element.classList.replace("bookmark--success", "bookmark--danger");
        else
          element.classList.replace("bookmark--danger", "bookmark--success");
      },

      getItemView = id => {
        return byId(id) || bySelector("tr", template.content.cloneNode(true));
      },

      removeItemView = id => {
        const element = getItemView(id);
        element.remove();
      }, 

      bindItemView = ({category, type, go}, element) => {
        const elements = byAll("td", element);
        elements[1].textContent = category;
        elements[2].textContent = go;
        return element;
      },

      renderItemView = data => {
        const { id, type } = data;
        const element = getItemView(id);
        
        element.id = id;
        element.dataset.data = JSON.stringify(data);
        setBookmark(element, type); 

        return bindItemView(data, element);
      },

      renderListView = result => {
        const fragment = document.createDocumentFragment();
        const data = result.payload;

        for(item of data)
          fragment.appendChild(renderItemView(item))
        
        tbodyElement.appendChild(fragment);
      },

      renderEditView = data => {
        const { id, category, go, type } = data;
        idFieldElement.value = id;
        nameFieldElement.value = category;
        typeFieldElement.value = type;
        goFieldElement.value = go;
      },

      renderSelectView = element => {
        rowActive.toggle(element);
        renderEditView(JSON.parse(element.dataset.data));
      },

      handleActive = e => {
        e.preventDefault();
        const element = e.target;
        if(element.nodeName === "TD")
          renderSelectView(element.parentNode)
      },

      handleAdd = (e) => {
        e.preventDefault();
        renderResetView();
      },

      handleSave = e => {
        const data = {
          "id": idFieldElement.value,
          "category": nameFieldElement.value,
          "go": goFieldElement.value,
          "type": typeFieldElement.value,
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
      }
    ;

    tbodyElement.addEventListener("click", handleActive);
    saveElement.addEventListener("click", handleSave);
    deleteElement.addEventListener("click", handleDelete);

    read();
  }

;
