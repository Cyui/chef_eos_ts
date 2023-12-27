import * as React from "react";
import MenuRow from "./MenuRow";
import { CProduct } from "../../../model/invoice";

interface IProps {
  menuProducts: Array<CProduct>;
  setMenuProducts: React.Dispatch<React.SetStateAction<Array<CProduct>>>;
}

const MenuList = ({ menuProducts, setMenuProducts }: IProps) => {
  return (
    <div>
      {menuProducts.map((item) => {
        return <MenuRow key={item.id} product={item} setMenuProducts={setMenuProducts} />;
      })}
    </div>
  );
};

export default MenuList;
