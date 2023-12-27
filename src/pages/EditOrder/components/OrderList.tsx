import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ProductRow from "./ProductRow";
import { COrder } from "../../../model/invoice";

interface IProps {
  orders: Array<COrder>;
  setOrders: React.Dispatch<React.SetStateAction<Array<COrder>>>;
}

const OrderList = ({ orders, setOrders }: IProps) => {
  return (
    <Box>
      <List>
        {orders.map((item) => {
          return <ProductRow key={item.id} id={item.id} order={item} setOrders={setOrders} />;
        })}
      </List>
    </Box>
  );
};

export default OrderList;
