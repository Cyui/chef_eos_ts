/**
 * Copyright Cyui
 * Last update date: 2024-01-04
 */

import { v4 } from "uuid";

class COption {
  id: string;
  tag: string;
  diff: number;

  constructor(id: string = "", tag: string = "", diff: number = 0) {
    this.id = id;
    this.tag = tag;
    this.diff = diff;
  }
}

class CProduct {
  id: string;
  name: string;
  price: number;
  options?: Array<COption> | undefined;

  constructor(id: string = "", name: string = "", price: number = 0, options?: Array<COption>) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.options = options;
  }

  get finalprice(): number {
    if (this.options) {
      return this.options.reduce((sum, option) => sum + option.diff, this.price);
    }

    return this.price;
  }

  get fullname(): string {
    if (this.options) {
      return this.options.reduce((sum, option) => sum + `[${option.tag}]`, this.name);
    }

    return this.name;
  }
}

class COrder {
  id: string;
  product: CProduct;
  quantity: number;

  constructor(id: string = v4(), product = new CProduct(), quantity: number = 1) {
    this.id = id;
    this.product = product;
    this.quantity = quantity;
  }

  get subtotal(): number {
    return this.quantity * this.product.finalprice;
  }
}

class CInfo {
  sn: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  note: string;
  deposit: number;
  deliver: string;
  status: string;

  constructor() {
    this.sn = "";
    this.name = "";
    this.phone = "";
    this.date = "";
    this.time = "";
    this.note = "";
    this.deposit = 0;
    this.deliver = "自取";
    this.status = "待處理";
  }
}

class CInvoice {
  id: string;
  no: number;
  timestamp: string;
  comment: string;
  orders: Array<COrder>;
  discount: number;
  info: CInfo;
  doc: string;

  constructor() {
    this.id = "";
    this.no = 0;
    this.timestamp = "";
    this.comment = "";
    this.orders = [];
    this.discount = 0;
    this.info = new CInfo();
    this.doc = "";
  }

  get total(): number {
    return this.orders.reduce((sum, order) => sum + order.subtotal, 0) + this.discount;
  }

  get finalpayment(): number {
    if (this.info !== undefined) {
      return this.total - this.info.deposit;
    }

    return this.total + this.discount;
  }

  add(product: CProduct, quantity: number) {
    let found = false;

    this.orders.forEach((order, index, array) => {
      if (JSON.stringify(order.product) === JSON.stringify(product)) {
        array[index].quantity += quantity;

        if (array[index].quantity <= 0) {
          array.splice(index, 1);
        }

        found = true;
      }
    });

    if (found === false) {
      this.orders.push(new COrder(v4(), product, quantity));
    }
  }

  delete(product: CProduct) {
    this.orders.forEach((order, index, array) => {
      if (JSON.stringify(order.product) === JSON.stringify(product)) {
        array.splice(index, 1);
      }
    });
  }

  submit() {
    if (this.orders.length > 0) {
      this.id = v4();
      this.timestamp = new Date().toLocaleString();
    }
  }

  clear() {
    this.id = "";
    this.timestamp = "";
    this.comment = "";
    this.orders = [];
  }
}

const invoiceFromObject = (obj: CInvoice): CInvoice => {
  let invoice = new CInvoice();

  if (obj) {
    invoice.id = obj.id;
    invoice.no = obj.no;
    invoice.timestamp = obj.timestamp;
    invoice.comment = obj.comment;
    invoice.orders = obj.orders.map((order) => {
      return new COrder(
        order.id,
        new CProduct(
          order.product.id,
          order.product.name,
          order.product.price,
          order.product.options?.map((option) => new COption(option.id, option.tag, option.diff))
        ),
        order.quantity
      );
    });
    invoice.discount = obj.discount;

    invoice.info = new CInfo();
    invoice.info.sn = obj.info.sn;
    invoice.info.name = obj.info.name;
    invoice.info.phone = obj.info.phone;
    invoice.info.date = obj.info.date;
    invoice.info.time = obj.info.time;
    invoice.info.note = obj.info.note;
    invoice.info.deposit = obj.info.deposit;
    invoice.info.deliver = obj.info.deliver;
    invoice.info.status = obj.info.status;

    invoice.doc = obj.doc;
  }

  return invoice;
};

export { COption, CProduct, COrder, CInfo, CInvoice, invoiceFromObject };
