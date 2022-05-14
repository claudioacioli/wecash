const
  componentRegister = () => {
    const
      formElement = bySelector("form"),
      nameElement = byId('name'),
      emailElement = byId('email'),
      passwordElement = byId('password'),
      submitElement = byId('submit'),

      create = data => {
        postUsers(data)
          .then(getResult)
          .then(async result => {
            console.log(result); 
          });
      },

      handleSubmit = e => {
        e.preventDefault();
        const name = nameElement.value;
        const email = emailElement.value;
        const password = passwordElement.value;

        create({name, email, password});

      }
    ;

    submitElement.addEventListener("click", handleSubmit);
  }
;
