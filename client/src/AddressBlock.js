import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import {shortenAddress} from "./utils/shortenAddress";
import {IconButton} from "@mui/material";
import {ContentCopy, Visibility} from "@mui/icons-material";

const AddressBlock = ({address}) => {
  const [shouldLengthenAddress, setShouldLengthenAddress] = useState(false);

  const copy = (selector) => {
    if (document.selection) {
      const div = document.body.createTextRange();
      div.moveToElementText(document.getElementById(selector));
      div.select();
    } else {
      const div = document.createRange();
      div.setStartBefore(document.getElementById(selector));
      div.setEndAfter(document.getElementById(selector)) ;
      window.getSelection().addRange(div);
    }
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  }

  return <div style={{display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
    <Typography variant="body1" component="div" sx={{marginRight: 5 }}>
      Address:
    </Typography>
    <Typography id={address} variant="body1" component="div" sx={{marginRight: 5 }}>
      {shouldLengthenAddress ? address: shortenAddress(address)}
    </Typography>
    {!shouldLengthenAddress && <IconButton color="secondary" size="medium" onClick={() => {
      setShouldLengthenAddress(true);
    }}>
      <Visibility fontSize="inherit" />
    </IconButton>}
    {shouldLengthenAddress &&
    <IconButton  color="secondary" size="small" onClick={() => {
      copy(address);
      setShouldLengthenAddress(false);
    }}>
      <ContentCopy fontSize="inherit" />
    </IconButton>
    }
  </div>
}

export default AddressBlock;