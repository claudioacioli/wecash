(function() {

  const 

    WECASH_ROUTE_INVOICES = "/invoices",
    WECASH_ROUTE_CATEGORIES = "/categories",
    WECASH_ROUTE_BANKS = "/banks",

    getRoute = () =>
      window.location.pathname
    ,

    app = () => { 
      switch(getRoute()) {
        case WECASH_ROUTE_INVOICES:
          return componentInvoices; 
        case WECASH_ROUTE_CATEGORIES:
          return componentCategories;
        case WECASH_ROUTE_BANKS:
          return componentBanks;
      }
    }
  ;

  app()();

})();
