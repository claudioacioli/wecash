const

  WECASH_API = "/api/1.0",

  getResult = async result =>  {
    
    if(result.status != 1)
      throw new Error("Resuls api error");

    return result;

  },
  
  getInvoices = async () => 
    await getData(`${WECASH_API}/invoices`)
  ,

  getCategories = async () =>
    await getData(`${WECASH_API}/categories`)
  ,

  getBanks = async () => 
    await getData(`${WECASH_API}/banks`)
;
