import React from 'react';
import { useTranslation } from 'react-i18next';

import MuiModal from '@mui/material/Modal';
import { Box, Button, Card } from '@mui/material';

import Title from '../../atoms/typography/Title';

const defaultProps = {
  children: undefined,
};

interface ModalProps {
  title: string,
  handleConfirmation: () => void,
  children?: React.ReactElement,
}

const Modal = function Modal({
  title,
  handleConfirmation,
  children,
}: ModalProps) {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = () => {
    setOpen(false);
    handleConfirmation();
  };

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
          <Title className="mb--24 mt--8" variant="header">{title}</Title>
          <Box className="row flex--center mt--8">
            <Button
              className="width--128 mr--8"
              type="button"
              variant="outlined"
              onClick={handleClose}
            >
              {t('no')}
            </Button>
            <Button
              className="width--128 ml--8"
              type="button"
              variant="contained"
              onClick={handleClick}
            >
              {t('quit')}
            </Button>
          </Box>
        </Card>
      </MuiModal>
    </>
  );
};

Modal.defaultProps = defaultProps;

export default Modal;
