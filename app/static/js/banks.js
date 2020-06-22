const
  
  componentBanks = () => {
    
    const
      template = byId("template-row-bank"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),
      inputElement = byId("input--bank"),
      submitElement = byId("btn-bank--submit"),

      getItemView = id => {
        return byId(id) || bySelector("tr", template.content.cloneNode(true));
      },

      bindItemView = ({bank, value="0,00"}, element) => {
        const elements = byAll("td", element);
        elements[1].textContent = bank;
        elements[2].textContent = value;
        return element;
      },

      renderItemView = item => {
        const element = getItemView(item.id);
        element.id = item.id;
        element.dataset.bank = JSON.stringify(item);
        return bindItemView(item, element);
      },

      renderListView = result => {
        const fragment = document.createDocumentFragment();
        const banks = result.payload;
        for(bank of banks)
          fragment.appendChild(renderItemView(bank));

        tbodyElement.appendChild(fragment);
      },

      handleSubmit = () => {
        const data = {
          "bank": inputElement.value,
          "user_id": 1
        };

        postBanks(data)
          .then(getResult)
          .then(async result => {
            return { ...result, payload: [result.payload]}
          })
          .then(renderListView)
          .catch(function(error) {
            console.log(error);
          });
      }
    ;

    submitElement.addEventListener("click", handleSubmit);

    getBanks()
      .then(getResult)
      .then(renderListView)
      .catch(function(error) {
        console.error(error);
      });
  }

;
