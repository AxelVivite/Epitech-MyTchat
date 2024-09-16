import React from 'react';

import MuiModal from '@mui/material/Modal';
import { Card } from '@mui/material';

import IconButton from '../../atoms/buttons/IconButton';
import AddRoom from './AddRoom';

const defaultProps = {
  children: undefined,
};

interface ModalProps {
  children?: React.ReactElement,
}

const ModalAddRoom = function Modal({
  children,
}: ModalProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {children
        && (
          <IconButton onClick={handleOpen} variant="transparent" type="button">
            {children}
          </IconButton>
        )}
      <MuiModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card className="col flex--center-align div--centered p--16">
          <AddRoom handleClose={handleClose} />
        </Card>
      </MuiModal>
    </>
  );
};

ModalAddRoom.defaultProps = defaultProps;

export default ModalAddRoom;
