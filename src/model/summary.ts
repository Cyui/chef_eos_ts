import { CInvoice, COption, CProduct, COrder } from "./invoice";
import * as firebase from "./firebase";

type CSummaryList = { main: string; qty: number; sub: { [key: string]: number } };

class CSummary {
  invoices: Array<CInvoice>;

  constructor(invoices: Array<CInvoice> = []) {
    this.invoices = invoices;
  }

  get total(): number {
    return this.invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  }

  report(): Array<{ name: string; qty: number }> {
    let list: Array<CSummaryList> = firebase.Menu.products.map((item) => {
      return { main: item.name, qty: 0, sub: {} };
    });

    this.invoices.forEach((invoice) => {
      invoice.orders.forEach((order) => {
        let obj = list.find((item) => item.main === order.product.name);
        if (obj) {
          if (order.product.options) {
            let tag = order.product.options[0]?.tag;

            if (!obj.sub[tag]) {
              obj.sub[tag] = 0;
            }

            obj.sub[tag] += order.quantity;
          }
          obj.qty += order.quantity;
        }
      });
    });

    let rows: Array<{ name: string; qty: number }> = [];

    list.forEach((item) => {
      rows.push({ name: item.main, qty: item.qty });

      Object.entries(item.sub).forEach((sub) => {
        rows.push({ name: "▹ 選項： [" + sub[0] + "]", qty: sub[1] });
      });
    });

    return rows;
  }
}

export { CSummary };
