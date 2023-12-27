import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { CProduct } from "../../../model/invoice";

interface IProps {
  product: CProduct;
  setMenuProducts: React.Dispatch<React.SetStateAction<Array<CProduct>>>;
}

const MenuRow = ({ product, setMenuProducts }: IProps) => {
  const [prodName, setProdName] = React.useState<string>(product.name);
  const [prodPrice, setProdPrice] = React.useState<number>(product.price);
  const productRef = React.useRef<CProduct>(product);

  React.useEffect(() => {
    productRef.current.name = prodName;
    productRef.current.price = prodPrice;

    pushMenuProduct();
  }, [prodName, prodPrice]);

  const pushMenuProduct = () => {
    setMenuProducts((products) => {
      return products.map((item) => {
        if (item.id === product.id) {
          item.name = productRef.current.name;
          item.price = productRef.current.price;
        }
        return item;
      });
    });
  };

  return (
    <div>
      <Stack direction="row" spacing={1} sx={{ m: 2 }}>
        <div>
          <TextField
            sx={{ width: 164 }}
            id="textName"
            label="品項"
            variant="outlined"
            //fullWidth
            value={prodName}
            onChange={(e) => {
              setProdName(e.target.value);
            }}
          />
        </div>

        <div>
          <TextField
            sx={{ width: 140 }}
            id="textPrice"
            label="價格"
            variant="outlined"
            //fullWidth
            value={prodPrice}
            onChange={(e) => {
              setProdPrice(Number(e.target.value) || 0);
            }}
          />
        </div>

        <IconButton
          aria-label="delete"
          onClick={() => {
            setMenuProducts((products) => {
              return products.filter((item) => item.id !== product.id);
            });
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </div>
  );
};

export default MenuRow;
