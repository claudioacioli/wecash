(function() {

  const 

    WECASH_ROUTE_INVOICES = "invoices",
    WECASH_ROUTE_CATEGORIES = "categories",
    WECASH_ROUTE_BANKS = "banks",
    WECASH_ROUTE_CARDS = "cards",

    getRoute = () => {
      return window.location.pathname.split("/")[1]
    },

    app = () => { 
      switch(getRoute()) {
        case WECASH_ROUTE_INVOICES:
          return componentInvoices; 
        case WECASH_ROUTE_CATEGORIES:
          return componentCategories;
        case WECASH_ROUTE_BANKS:
          return componentBanks;
        case WECASH_ROUTE_CARDS:
          return componentCards;
        default:
          return () => {
            console.warn("route not set");
          };
      }
    }
  ;
  //console.log(getRoute());
  //console.log(app());
  app()();

})();
