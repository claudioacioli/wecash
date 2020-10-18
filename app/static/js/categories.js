const
  
  componentCategories = () => {
    
    const 
      template = byId("template-row-category"),
      errorElements = byAll("span.textfield__error"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),
      idFieldElement = byId("field--id"),
      nameFieldElement = byId("field--name"),
      nameErrorElement = errorElements[0],
      typeFieldElement = byName("field--type"),
      goFieldElement = byId("field--go"),
      goErrorElement = errorElements[1],
      addElement = byId("btn--add"),
      saveElement = byId("btn--save"),
      deleteElement = byId("btn--delete"),
      resetElement = byId("btn--reset"),
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
        rowActive.toggle(null);
        deleteElement.classList.add("hide");
        renderResetErrorLabel();
        idFieldElement.value = "";
        nameFieldElement.value = "";
        typeFieldElement.item(0).checked = true;
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
        elements[0].textContent = category;
        elements[1].textContent = toCurrencyBRL(go);
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

      renderTypeView = (elements, value) => {
        for(element of elements)
          if(element.value === value)
            element.checked = true;
      },

      renderEditView = data => {
        const { id, category, go, type } = data;
        idFieldElement.value = id;
        nameFieldElement.value = category;
        renderTypeView(typeFieldElement, type);
        goFieldElement.value = parseFloat(go).toFixed(2);
        nameFieldElement.select();
      },

      renderSelectView = element => {
        rowActive.toggle(element);
        deleteElement.classList.remove("hide");
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
        nameFieldElement.focus();
      },

      getValueOfRadio = elements => {
        for(element of elements)
          if(element.checked)
            return element.value;
      },

      renderResetErrorLabel = () => {
        nameErrorElement.innerHTML = "Por favor, informe um nome v&#225;lido.";
        nameErrorElement.style.display = "none";
        goErrorElement.textContent = "";
        goErrorElement.style.display = "none";
      },

      handleSave = e => { 

        let send = true;

        if(!nameFieldElement.value.toString().trim().length) {
          send = false;
          nameErrorElement.innerHTML = "Por favor, informe um nome v&#225;lido.";
          nameErrorElement.style.display = "block";
        }

        if(!goFieldElement.value.toString().trim().length) {
          send = false;
          goErrorElement.innerHTML = "Por favor, informe uma meta mensal.";
          goErrorElement.style.display = "block";
        }

        if(!send) 
          return;

        renderResetErrorLabel();

        const data = {
          "id": idFieldElement.value,
          "category": nameFieldElement.value,
          "go": goFieldElement.value,
          "type": getValueOfRadio(typeFieldElement),
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
      },

      handleMask = e => {
        const value = e.target.value;
        e.target.value = parseFloat(
          value
            .replace(/(.*){1}/, '0$1')
            .replace(/[^\d]/g, '')
            .replace(/(\d\d?)$/, '.$1')
        ).toFixed(2);
      },

      handlePress = e => {
        onlyCurrencyDigits(e);
      },

      handleFocus = e => {
        if(!e.target.value.toString().trim().length)
          e.target.value = "00.0";
      }
    ;

    goFieldElement.addEventListener("keypress", handlePress);
    goFieldElement.addEventListener("keyup", handleMask);
    goFieldElement.addEventListener("focus", handleFocus);

    addElement.addEventListener("click", handleAdd);
    tbodyElement.addEventListener("click", handleActive);
    saveElement.addEventListener("click", handleSave);
    deleteElement.addEventListener("click", handleDelete);
    resetElement.addEventListener("click", handleReset);

    read();
  }

;
