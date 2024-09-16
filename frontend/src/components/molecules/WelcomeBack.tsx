import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
} from '@mui/material';

import { useGlobalState } from '../../utils/globalStateManager/globalStateInit';

const WelcomeBack = function WelcomeBack(): React.ReactElement<unknown, string> | null {
  const { state } = useGlobalState();
  const { t } = useTranslation();

  return (
    <Box
      className="row flex--center width--full flex--center-align"
      sx={{ minHeight: 'calc(100vh - 96px)', maxHeight: 'calc(100vh - 96px)' }}
    >
      <Box style={{ marginBottom: '20vh' }}>
        <Card className="col p--16 width--280 flex--center-align m--auto">
          <p style={{ fontSize: '24px' }} className="mb--16 mt--8">
            {`\u2B50  ${t('welcome')}  \u2B50`}
          </p>
          <p style={{ fontSize: '32px' }} className="mb--24">
            {state.user?.username}
          </p>
        </Card>
      </Box>
    </Box>
  );
};

export default WelcomeBack;
