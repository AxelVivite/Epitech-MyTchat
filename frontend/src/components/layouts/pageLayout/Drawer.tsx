import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Drawer as MuiDrawer,
} from '@mui/material/';
import AddIcon from '@mui/icons-material/Add';

import Rooms from '../../molecules/Rooms';

import ModalAddRoom from './ModalAddRoom';
import Title from '../../atoms/typography/Title';

interface DrawerProps {
  handleClickDrawerButton: () => void,
  isDrawerOpen: boolean,
}

const Drawer = function Drawer({
  handleClickDrawerButton,
  isDrawerOpen,
}: DrawerProps) {
  const { t } = useTranslation();

  const drawer = (
    <>
      <Box className="row border--bottom p--16 height--32 flex--space-between">
        <Title className="line-height--32" variant="room">
          {t('rooms')}
        </Title>
        <ModalAddRoom>
          <AddIcon />
        </ModalAddRoom>
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
