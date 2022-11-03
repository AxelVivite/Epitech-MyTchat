import React from 'react';

import MuiModal from '@mui/material/Modal';
import { Card } from '@mui/material';
import Button from '../atoms/buttons/Button';
import IconButton from '../atoms/buttons/IconButton';

const defaultProps = {
  buttonLabel: undefined,
  iconButton: undefined,
  children: undefined,
};

interface ModalProps {
  buttonLabel?: string,
  iconButton?: React.ReactElement,
  children?: React.ReactElement,
}

const Modal = function Modal({
  buttonLabel,
  iconButton,
  children,
}: ModalProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {(
        buttonLabel
        && <Button onClick={handleOpen} type="button">{buttonLabel}</Button>
      ) || (
        iconButton && (
          <IconButton onClick={handleOpen} variant="transparent" type="button">
            {iconButton}
          </IconButton>
        )
      )}
      <MuiModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card className="modal--content width--70p height--70p p--24">
          {children}
        </Card>
      </MuiModal>
    </>
  );
};

Modal.defaultProps = defaultProps;

export default Modal;
