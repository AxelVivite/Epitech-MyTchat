import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
} from '@mui/material';

const PageNotFound = function PageNotFound(): ReactElement<unknown, string> | null {
  const { t } = useTranslation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('darkTheme') === 'true') {
      document.body.classList.add('dark-theme');
    }
  }, []);

  return (
    <Box>
      <Card className="col flex--center-align div--centered p--24">
        <p style={{ fontSize: '64px' }} className="mt--8 mb--16">404</p>
        <p style={{ fontSize: '30px' }} className="mb--24">
          {t('page_not_found')}
        </p>
        <Button
          className="mt--8px mb--16px"
          sx={{ fontSize: '20px' }}
          type="button"
          variant="contained"
          onClick={() => navigate('/')}
        >
          {t('come_back')}
        </Button>
      </Card>
    </Box>
  );
};

export default PageNotFound;
