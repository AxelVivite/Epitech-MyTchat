import React from "react";

import Button from "../atoms/Button";
import IconButton from "../atoms/IconButton";
import { default as MuiModal } from "@mui/material/Modal";

type clickableVariantType = "button" | "iconButton";

interface ModalProps {
    buttonLabel: JSX.Element;
    children: JSX.Element;
    clickableVariant: clickableVariantType;
}

const Modal = (props: ModalProps) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            {(
                props.clickableVariant === "button" &&
                <Button onClick={handleOpen}>{props.buttonLabel}</Button>
                ) || (
                props.clickableVariant === "iconButton" &&
                <IconButton onClick={handleOpen}>
                    {props.buttonLabel}
                </IconButton>
            )}
            <MuiModal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {props.children}
            </MuiModal>
        </>
    );
};

export default Modal;