const

  WECASH_API = "/api/1.0",

  getResult = async result =>  {
    
    if(result.status != 1)
      throw new Error("Resuls api error");

    return result;

  },
  
  getMovimentos = async () => 
    await getData(`${WECASH_API}/movimentos`)
  ,

  getCategorias = async () =>
    await getData(`${WECASH_API}/categorias`)
  ,

  getContas = async () => 
    await getData(`${WECASH_API}/contas`)
;
