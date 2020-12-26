const

  componentBill = () => {
    
    const 
      template = byId("template-row-bill"),
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),      
      monthFilterElement = byId("filter--month"),
      yearFilterElement = byId("filter--year"),

      read = async (year, month) => {
        const result = await getBills(year, month);
        console.log(result);
        renderListView(result);
      },

      toCurrency = value => 
        value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      ,

      getItemView = (id, t = template) => {
        return byId(id) || bySelector("tr", t.content.cloneNode(true));
      },

      bindItemView = ({history, confirmation_date, confirmed_value, bank, category}, element) => {
        const elements = byAll("td", element);

        elements.item(0).textContent = bank.name;
        elements.item(1).textContent = toCurrency(confirmed_value);
        elements.item(2).textContent = formatDateBR(fromDate(confirmation_date));
        elements.item(3).textContent = category.category;
        elements.item(4).textContent = history;

        return element;
      },

      renderItemView = data => { 
        
        const { id } = data;
        const element = getItemView(id);

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() -1);
        
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
      }
    ;

    read(yearFilterElement.value, monthFilterElement.value);
  }
;
