import React from "react";

import Button from "../atoms/buttons/Button";
import IconButton from "../atoms/buttons/IconButton";
import { default as MuiModal } from "@mui/material/Modal";
import { Card } from "@mui/material";

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
                <Button onClick={handleOpen} type="button">{props.buttonLabel}</Button>
            ) || (
                    props.clickableVariant === "iconButton" &&
                    <IconButton onClick={handleOpen} variant="transparent" type="button">
                        {props.buttonLabel}
                    </IconButton>
                )}
            <MuiModal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card className="modal--content width--70p height--70p p--24">
                    {props.children}
                </Card>
            </MuiModal>
        </>
    );
};

export default Modal;