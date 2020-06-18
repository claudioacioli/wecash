(function() {

  const 

    WECASH_ROUTE_MOVIMENTOS = "/movimentos",
    WECASH_ROUTE_CATEGORIAS = "/categorias",
    WECASH_ROUTE_CONTAS = "/contas",

    getRoute = () =>
      window.location.pathname
    ,

    app = () => {
      
      switch(getRoute()) {
        case WECASH_ROUTE_MOVIMENTOS:
          return componentMovimentos;
        
        case WECASH_ROUTE_CATEGORIAS:
          return componentCategorias;

        case WECASH_ROUTE_CONTAS:
          return componentContas;
      }

    }
  ;

  app()();

})();
