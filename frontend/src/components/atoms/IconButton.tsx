import React from "react";

import { default as MuiIconButton } from "@mui/material/IconButton";

interface IconButtonProps {
    children?: JSX.Element;
    className?: string;
    onClick?: () => void;
}

const IconButton = (props: IconButtonProps) => {
    return (
        <MuiIconButton
            className={props.className}
            onClick={props.onClick}
            size="small"
            sx={{m: "none"}}
        >
            {props.children}
        </MuiIconButton>
    );
};

export default IconButton;