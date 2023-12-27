import * as React from "react";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import * as firebase from "../../../model/firebase";

interface IProps {
  optionValid: string[];
  setOptionValid: React.Dispatch<React.SetStateAction<string[]>>;
}

const ValidList = ({ optionValid, setOptionValid }: IProps) => {
  return (
    <div>
      {optionValid.map((item) => {
        return (
          <ValidRow
            key={item}
            vid={item}
            optionValid={optionValid}
            setOptionValid={setOptionValid}
          />
        );
      })}
    </div>
  );
};

interface IProps2 {
  vid: string;
  optionValid: string[];
  setOptionValid: React.Dispatch<React.SetStateAction<string[]>>;
}

const ValidRow = ({ vid, optionValid, setOptionValid }: IProps2) => {
  const menu = firebase.Menu;

  const [idName, setIdName] = React.useState<string | null>(
    firebase.Menu.products.find((product) => product.id === vid)?.name || null
  );

  const [validNameList, setValidNameList] = React.useState<Array<{ id: string; name: string }>>(
    menu.products.map((item) => {
      return { id: item.id, name: item.name };
    }) || []
  );

  const handleSelectValidChange = (event: SelectChangeEvent) => {
    setIdName(event.target.value);
    setOptionValid((vids) => {
      return vids.map((item) => {
        if (item === vid) {
          item = firebase.Menu.products.find((product) => product.name === event.target.value)!.id; // ???
        }
        return item;
      });
    });
  };

  return (
    <div>
      <Stack direction="row" spacing={1} sx={{ mx: 1 }}>
        <KeyboardArrowRightIcon color="disabled" sx={{ my: 1.5 }} />
        <FormControl sx={{ ml: 2 }} size="small">
          <InputLabel id="label_option">可用</InputLabel>
          <Select
            labelId="label_option"
            id="option_select"
            sx={{ width: 232 }}
            defaultValue=""
            value={idName || ""}
            label="可用"
            onChange={handleSelectValidChange}
            onOpen={() => {
              setValidNameList(
                validNameList.filter((item) => {
                  return !optionValid.includes(item.id) || item.name === idName;
                })
              );
            }}
          >
            {validNameList.map((item) => {
              return (
                <MenuItem key={item.id} value={item.name}>
                  {item.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <IconButton
          aria-label="delete"
          onClick={() => {
            setOptionValid((valid) => {
              return valid.filter((item) => item !== vid);
            });
          }}
        >
          <RemoveCircleIcon color="error" />
        </IconButton>
      </Stack>
    </div>
  );
};

export default ValidList;
