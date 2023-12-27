import { app } from "../firebase-config";
import { getAuth, signOut, Auth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  updateDoc,
  addDoc,
  deleteDoc,
  where,
  FieldPath,
  Firestore,
} from "firebase/firestore";
import { CInvoice, invoiceFromObject } from "./invoice";
import { CMenu, menuFromObject } from "./chefmenu";

// Initialize Cloud Firestore and get a reference to the service
export const db:Firestore = getFirestore(app);

export var Invoices: Array<CInvoice> = [];
export var LastInvoiceNO: number = 0;
export var Menu = new CMenu();

const auth: Auth = getAuth();
export var Mail: string = "";

export function setInvoices(invoices: Array<CInvoice>) {
  Invoices = [...invoices];
}

export function updateInvoices(invoice: CInvoice) {
  Invoices.forEach((item, index, array) => {
    if (item.id === invoice.id) {
      array[index] = invoice;
    }
  });
}

const invoiceConverter = {
  toFirestore: (invoice: CInvoice) => {
    return invoice;
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return invoiceFromObject(data);
  },
};

const menuConverter = {
  toFirestore: (menu: CMenu) => {
    return menu;
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return menuFromObject(data);
  },
};

export function getUserInfoFromFirebase() {
  if (auth !== null) {
    Mail = auth.currentUser!.email || "";
  }
}

export function logOut() {
  if (auth !== null) {
    signOut(auth)
      .then(function () {
        // Sign-out successful.
        console.log("logout success");
      })
      .catch(function (error) {
        // An error happened.
        console.log("logout error");
      });
  }
}

export async function pushInvoiceToFirebase(invoice: CInvoice) {
  // const ref = doc(collection(db, Mail, "eos_invioces", "2024y"))
  const ref = collection(db, Mail, "eos_invioces", "2024y");

  const docref = await addDoc(ref, JSON.parse(JSON.stringify(invoice)));

  await updateDoc(doc(ref, docref.id), { doc: docref.id });
}

export async function pushMenuToFirebase(menu: CMenu) {
  const ref = doc(db, Mail, "eos_menu", "2024y", "current");
  //const ref = collection(db, Mail, "eos_menu", "2024y");

  const docref = await setDoc(ref, JSON.parse(JSON.stringify(menu)));
}

export async function updateInvoiceToFirebase(invoice: CInvoice, docid: string) {
  const ref = doc(db, Mail, "eos_invioces", "2024y", docid);

  await updateDoc(ref, JSON.parse(JSON.stringify(invoice)));
}

export async function pullAllInvoiceFromFirebase() {
  let invoices: Array<CInvoice> = [];

  const ref = collection(db, Mail, "eos_invioces", "2024y").withConverter(
    invoiceConverter
  );

  const q = query(ref, orderBy("no", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
    let invoice = doc.data();
    invoice.doc = doc.id;
    invoices = [...invoices, invoice];
  });

  Invoices = invoices;
}

export async function pullMenuFromFirebase() {
  let menu = new CMenu();

  const ref = doc(db, Mail, "eos_menu", "2024y", "current").withConverter(
    menuConverter
  );

  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    // Convert to City object
    menu = docSnap.data();
    // Use a City instance method
    //console.log(doc);
  } else {
    console.log("No such document!");
  }

  Menu = menu;
}

// export async function queryInvoiceBySnFromFirebase(sn) {

//   const ref = collection(db, Mail, "eos_invioces", "2024y").withConverter(invoiceConverter);

//   const q = query(ref, where(new FieldPath('info', 'sn'), '==', sn))

//   const querySnapshot = await getDocs(q);
//   querySnapshot.forEach((doc) => {
//     // doc.data() is never undefined for query doc snapshots
//     console.log(doc.id, " => ", doc.data());
//   });
// }

export async function deleteInvoiceFromFirebase(docid: string) {
  const ref = doc(db, Mail, "eos_invioces", "2024y", docid);

  await deleteDoc(ref);
}

export async function getLastInvoiceFromFirebase() {
  let no = 0;

  const ref = collection(db, Mail, "eos_invioces", "2024y");
  const q = query(ref, orderBy("no", "desc"), limit(1));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
    no = doc.data().no;
  });

  LastInvoiceNO = no;
  //console.log(LastInvoiceNO)
}
