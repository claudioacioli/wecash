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
  ,

  postBanks = async data => 
    await postData(`${WECASH_API}/banks/`, data)

  putBanks = async data => 
    await putData(`${WECASH_API}/banks/${data.id}`, data)
  ,

  deleteBanks = async id => 
    await deleteData(`${WECASH_API}/banks/${id}`)
;
