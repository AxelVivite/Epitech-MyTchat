import React from 'react';

import MuiModal from '@mui/material/Modal';
import { Card } from '@mui/material';
import Button from '../atoms/buttons/Button';
import IconButton from '../atoms/buttons/IconButton';

type clickableVariantType = 'button' | 'iconButton';

const Modal = function Modal(
  buttonLabel: React.ReactElement<unknown, string> | null,
  children: React.ReactElement<unknown, string> | null,
  clickableVariant: clickableVariantType,
): React.ReactElement<unknown, string> | null {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {(
        clickableVariant === 'button'
        && <Button onClick={handleOpen} type="button">{buttonLabel}</Button>
      ) || (
        clickableVariant === 'iconButton' && (
          <IconButton onClick={handleOpen} variant="transparent" type="button">
            {buttonLabel}
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

export default Modal;
