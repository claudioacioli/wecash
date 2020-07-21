const

  componentResumeCategory = () => {

    const
      monthFilterElement = byId("filter--month"),
      yearFilterElement = byId("filter--year"),
      tbodyElement = bySelector("tbody"),

      read = (year, month) => {

        getResumeCategoryByYearMonth(year, month)
          .then(getResult)
          .then(renderListView)
          .catch(function(err) {
            console.error(err);
          });

      },

      renderItemView = data => {
        const { name, type, expected_value, goal } = data;
        const element = document.createElement("tr");
        const nameElement = document.createElement("td");
        const valueElement = document.createElement("td");
        const goalElement = document.createElement("td");

        element.classList.add(
          "bookmark", 
          type === "D" 
            ? "bookmark--danger" 
            : "bookmark--success"
        );

        nameElement.textContent = name;
        nameElement.style.width = "80%"; 
        element.appendChild(nameElement);

        goalElement.textContent = goal;
        goalElement.style.width = "1%";
        element.appendChild(goalElement);

        valueElement.textContent = expected_value;
        valueElement.style.width = "1%";
        element.appendChild(valueElement);

        return element;

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

  },
  
  componentResume = () => {
    
    const typeFilterElement = byId("filter--type");

    switch(typeFilterElement.value) {
      case WECASH_RESUME_TYPE_CATEGORY:
        return componentResumeCategory();
    }

  }

;
