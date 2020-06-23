const
  
  componentCategories = () => {
    
    const 
      template = byId("template-row-category"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),
      saveElement = byId("btn--save"),

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

      handleSave = e => {
        const data = {
          "category": "Teste",
          "go": 100,
          "type": "D"
        }
        create(data);
      }
    ;

    saveElement.addEventListener("click", handleSave);

    getCategories()
      .then(getResult)
      .then(renderListView)
      .catch(function(error) {
        console.error(error);
      });
  }

;
