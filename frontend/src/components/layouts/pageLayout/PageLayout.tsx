import React from 'react';

import { Box } from '@mui/material';

import Drawer from './Drawer';
import Header from './Header';

interface PageLayoutProps {
    children: React.ReactNode;
}

function PageLayout(props: PageLayoutProps): JSX.Element {
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
        {props.children}
      </Box>
    </>
  );
}

export default PageLayout;
