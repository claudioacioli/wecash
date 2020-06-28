const
  
  componentCards = () => { 
    
    const 
      tableElement = bySelector("table"),
      tbodyElement = bySelector("tbody", tableElement),
      idFieldElement = byId("field--id"),
      nameFieldElement = byId("field--name"),
      dayFieldElement = byId("field--day"),
      limitFieldElement = byId("field--limit"),
      goalFieldElement = byId("field--goal"),
      saveButtonElement = byId("btn--save"),
      rowActive = new ActiveElement("is-active")

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

    saveButtonElement.addEventListener("click", handleSave);

  }

;
