const
  
  componentCategories = () => {
    
    const 
      template = byId("template-row-category"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),
      nameFieldElement = byId("field--name"),
      typeFieldElement = byId("field--type"),
      goFieldElement = byId("field--go"),
      saveElement = byId("btn--save"),
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
            reset();
            return { ...result, payload: [result.payload]}
          })
          .then(renderListView)
          .catch(function(error) {
            console.log(error);
          });
      },

      reset = () => {
        nameFieldElement.value = "";
        typeFieldElement.value = "D";
        goFieldElement.value = "";
      },

      setBookmark = (element, type) => {
        if(type === "D")
          element.classList.replace("bookmark--success", "bookmark--danger");
        else
          element.classList.add("bookmark--danger", "bookmark--success");
      },

      getItemView = id => {
        return byId(id) || bySelector("tr", template.content.cloneNode(true));
      },

      bindItemView = ({category, type, go}, element) => {
        const elements = byAll("td", element);
        elements[1].textContent = category;
        elements[2].textContent = go;
        return element;
      },

      renderItemView = item => {
        const fragment = template.content.cloneNode(true);
        const element = bySelector("tr", fragment);
        element.dataset.category = JSON.stringify(item);
        setBookmark(element, item.type); 
        return bindItemView(item, fragment);
      },

      renderListView = result => {
        const fragment = document.createDocumentFragment();
        const data = result.payload;

        for(item of data)
          fragment.appendChild(renderItemView(item))
        
        tbodyElement.appendChild(fragment);
      },

      renderSelectView = element => {
        rowActive.toggle(element);
      },

      handleActive = e => {
        e.preventDefault();
        const element = e.target;
        if(element.nodeName === "TD")
          renderSelectView(element.parentNode)
      },

      handleSave = e => {
        const data = {
          "category": nameFieldElement.value,
          "go": goFieldElement.value,
          "type": typeFieldElement.value,
          "user_id": 1
        }

        create(data);
      }
    ;

    tbodyElement.addEventListener("click", handleActive);
    saveElement.addEventListener("click", handleSave);

    read();
  }

;
