const

  WECASH_API = "/api/1.0",

  getCookie = cname => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },

  token = getCookie("token"),

  getResult = async result =>  { 
    if(result.status !== 1)
      throw new Error("Resuls api error");
    return result;
  },

  getResumeCategoryByYearMonth = async (year, month) => 
    await getData(`${WECASH_API}/resume/category/${year}/${month}`, token)
  ,

  getBills = async (year, month) =>
    await getData(`${WECASH_API}/bills/${year}/${month}`, token)
  ,

  getInvoices = async () => 
    await getData(`${WECASH_API}/invoices`, token)
  ,

  getInvoicesOverview = async (year, month, bank_id=0) =>
    await getData(`${WECASH_API}/overview/${year}/${month}?b=${bank_id}`, token)
  ,

  getInvoicesByYearMonth = async (year, month, bank_id=0) => 
    await getData(`${WECASH_API}/invoices/${year}/${month}?b=${bank_id}`, token)
  ,

  getCategoryInvoiceByYearMonth = async (year, month, bank_id=0) =>
    await getData(`${WECASH_API}/invoices/${year}/${month}?v=C`, token)
  ,
  postInvoices = async data => 
    await postData(`${WECASH_API}/invoices/`, token, data)
  ,

  putInvoices = async data =>
    await putData(`${WECASH_API}/invoices/${data.id}`, token, data)
  ,

  deleteInvoices = async id => 
    await deleteData(`${WECASH_API}/invoices/${id}`, token)
  ,

  getCategories = async (type="") =>
    await getData(`${WECASH_API}/categories/?t=${type}`, token)
  ,

  postCategories = async data => 
    await postData(`${WECASH_API}/categories/`, token, data)
  ,

  putCategories = async data => 
    await putData(`${WECASH_API}/categories/${data.id}`, token, data)

  deleteCategories = async id => 
    await deleteData(`${WECASH_API}/categories/${id}`, token)
  ,

  getBanks = async () => 
    await getData(`${WECASH_API}/banks`, token)
  ,

  postBanks = async data => 
    await postData(`${WECASH_API}/banks/`, token, data)
  ,

  putBanks = async data => 
    await putData(`${WECASH_API}/banks/${data.id}`, token, data)
  ,

  deleteBanks = async id => 
    await deleteData(`${WECASH_API}/banks/${id}`, token)
  ,

  getCards = async () => 
    await getData(`${WECASH_API}/cards`, token)
  ,

  postCards = async data =>
    await postData(`${WECASH_API}/cards/`, token, data)

  putCards = async data => 
    await putData(`${WECASH_API}/cards/${data.id}`, token, data)
  ,

  deleteCards = async id => 
    await deleteData(`${WECASH_API}/cards/${id}`, token)
  ,

  postUsers = async data => 
    await postData(`${WECASH_API}/users/`, token, data)
;
