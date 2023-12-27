import { CInvoice, COption, CProduct, COrder } from "./invoice";

class CSummary {
  invoices: Array<CInvoice>

  constructor(invoices: Array<CInvoice> = []) {
    this.invoices = invoices;
  }

  get total(): number {
    return this.invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  }

  getOrdersDict(orders: Array<COrder>): {fullDict: { [key: string]: number }, mainDict: { [key: string]: number }} {
    let fullDict: { [key: string]: number } = {};
    let mainDict: { [key: string]: number } = {};

    orders.forEach(order => {
        fullDict[order.product.fullname] = (fullDict[order.product.fullname] || 0 ) + order.quantity;
        mainDict[order.product.name] = (mainDict[order.product.name] || 0 ) + order.quantity;
    });

    return {fullDict, mainDict};
  };

  report(): Array<{name: string, qty: number, per: number}> {
    let fullResult: { [key: string]: number } = {};
    let mainResult: { [key: string]: number } = {};

    this.invoices.forEach(invoice => {
      var { fullDict, mainDict } = this.getOrdersDict(invoice.orders);

      for (let key in mainDict) {
        mainResult[key] = (mainResult[key] || 0) + mainDict[key];
      }

      for (let key in fullDict) {
        fullResult[key] = (fullResult[key] || 0) + fullDict[key];
      }
    });

    let rows: Array<{name: string, qty: number, per: number}> = []

    for (let fullKey in fullResult) {
      let per: number = 0

      for (let mainKey in mainResult) {
        if(fullKey.search(mainKey) === 0) 
         per = mainResult[mainKey]
      }

      rows = [...rows, { name: fullKey, qty: fullResult[fullKey], per: per} ]
    }

    return rows
  }
}

export { CSummary };
