(function() {

  const 

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
        case WECASH_ROUTE_RESUME:
          return componentResume;
        case WECASH_ROUTE_REGISTER:
          return componentRegister;
        case WECASH_ROUTE_BILL:
          return componentBill;
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
