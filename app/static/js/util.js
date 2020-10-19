const
  
  DIGITS_CURRENCY = '0123456789.,'
    .split('')
    .map(item => item.charCodeAt())
  ,

  onlyCurrencyDigits = e => {
    if(DIGITS_CURRENCY.indexOf(e.which) === -1)
      e.preventDefault();
  },

  maskCurrency = value =>
    parseFloat(value
      .replace(/(.*){1}/, '0$1')
      .replace(/[^\d]/g, '')
      .replace(/(\d\d?)$/, '.$1')
    ).toFixed(2)
  ,

  initCurrency = value => {
    if(!value.toString().trim().length)
      return "0.00"
    return value;
  },

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
