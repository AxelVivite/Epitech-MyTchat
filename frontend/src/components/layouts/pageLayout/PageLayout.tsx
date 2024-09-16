import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';

import { useGlobalState } from '../../../utils/globalStateManager/globalStateInit';

import Drawer from './Drawer';
import Header from './Header';

interface PageLayoutProps {
  children: React.ReactNode,
}

const PageLayout = function PageLayout({
  children,
}: PageLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const navigate = useNavigate();
  const { state } = useGlobalState();

  const handleClickDrawerButton = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  React.useEffect(() => {
    if (Object.keys(state).length === 0) {
      navigate('/sign-in');
    }
  }, [state, navigate]);

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
