const
  
  componentBanks = () => {
    
    const
      template = byId("template-row-bank"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),

      bindItemView = ({bank, value="0,00"}, element) => {
        const elements = byAll("td", element);
        elements[1].textContent = bank;
        elements[2].textContent = value;
        elements[2].classList.add("text--right");
        return element;
      },

      renderItemView = item => {
        return bindItemView(item, template.content.cloneNode(true));
      },

      renderListView = result => {
        const fragment = document.createDocumentFragment();
        const { banks } = result.payload;
        for(bank of banks)
          fragment.appendChild(renderItemView(bank));

        tbodyElement.appendChild(fragment);
      }
    ;

    getBanks()
      .then(getResult)
      .then(renderListView)
      .catch(function(error) {
        console.error(error);
      });
  }

;
