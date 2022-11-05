import React from 'react';

import MuiModal from '@mui/material/Modal';
import { Box, Card } from '@mui/material';

import InviteRoom from './InviteRoom';

const defaultProps = {
  children: undefined,
};

interface ModalProps {
  children?: React.ReactElement,
}

const ModalInviteRoom = function Modal({
  children,
}: ModalProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {children
        && (
          <Box onClick={handleOpen}>
            {children}
          </Box>
        )}
      <MuiModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card className="col flex--center-align div--centered p--16">
          <InviteRoom handleClose={handleClose} />
        </Card>
      </MuiModal>
    </>
  );
};

ModalInviteRoom.defaultProps = defaultProps;

export default ModalInviteRoom;
