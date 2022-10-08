import React from "react";

import { default as MuiButton } from "@mui/material/Button";

interface ButtonProps {
    children?: JSX.Element;
    onClick: () => void;
}

const Button = (props: ButtonProps) => {
    return (
        <MuiButton onClick={props.onClick}>
            {props.children}
        </MuiButton>
    );
};

export default Button;