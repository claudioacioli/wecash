const
  
  toDate = date => {
    try {
      if(date)
        return new Date(
          date.substr(0,4), 
          date.substr(5,2) - 1, 
          date.substr(8,2)
        );
      return null;
    } catch (ex) {
      return null;
    }
  },

  toTime = date => {
    try {
      if(date)
        return new Date(
          date.substr(0,4), 
          date.substr(5,2) - 1, 
          date.substr(8,2)
        ).getTime();
      return null;
    } catch (ex) {
      return null;
    }
  },

  fromDate = time => {
    if(time)
      return new Date(time);
    return null;
  },

  formatDate = date => {
    if(date)
      return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`
    return null;
  },

  formatDateBR = date => {
    if(date)
      return `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getFullYear()}`
    return null;
  },

  toCurrencyBRL = value => 
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
;
