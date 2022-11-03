import { useTranslation } from 'react-i18next';

import {
  Box,
  Drawer as MuiDrawer,
} from '@mui/material/';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

import Rooms from '../../molecules/Rooms';

import AddRoom from './AddRoom';
import Modal from '../../molecules/Modal';
import Title from '../../atoms/typography/Title';

const Drawer = function Drawer(
  handleClickDrawerButton: () => void,
  isDrawerOpen: boolean,
): React.ReactElement<unknown, string> | null {
  const { t } = useTranslation();

  const drawer = (
    <>
      <Box className="row border--bottom p--16 height--32 flex--space-between">
        <Title className="line-height--32" variant="room">
          {t('rooms')}
        </Title>
        <Modal
          buttonLabel={<AddIcon />}
          clickableVariant="iconButton"
        >
          <AddRoom />
        </Modal>
      </Box>
      <Rooms />
    </>
  );

  return (
    <>
      <MuiDrawer
        id="drawer"
        variant="temporary"
        open={isDrawerOpen}
        onClose={handleClickDrawerButton}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: '280px' },
        }}
      >
        {drawer}
      </MuiDrawer>
      <MuiDrawer
        id="drawer"
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: '280px' },
        }}
      >
        {drawer}
      </MuiDrawer>
    </>
  );
};

export default Drawer;
