import React from "react";

import TextField from "@mui/material/TextField";

const InputMessage = (): JSX.Element => {
    return (
        <div>
            <TextField id="outlined-basic" placeholder="Message" variant="outlined" />
        </div>
    );
};

export default InputMessage;