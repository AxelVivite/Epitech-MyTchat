import React from 'react';

import { Box } from '@mui/material';

import Drawer from './Drawer';
import Header from './Header';

const PageLayout = function PageLayout(
  children: React.ReactNode,
): React.ReactElement<unknown, string> | null {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleClickDrawerButton = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <Drawer handleClickDrawerButton={handleClickDrawerButton} isDrawerOpen={isDrawerOpen} />
      <Box
        id="main"
        sx={{
          maxWidth: '1400px',
          paddingLeft: { md: '296px' },
          padding: '0 16px',
          margin: 'auto',
        }}
      >
        <Header handleClickDrawerButton={handleClickDrawerButton} />
        {children}
      </Box>
    </>
  );
};

export default PageLayout;
