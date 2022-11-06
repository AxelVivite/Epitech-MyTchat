import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import * as yup from 'yup';
import { withFormik } from 'formik';
import {
  Card,
  Box,
  TextField,
  Button,
} from '@mui/material';
import { register } from '../../utils/userManagment';

import logo from '../../assets/logo.png';
import logoDark from '../../assets/logo-dark.png';
import Title from '../atoms/typography/Title';

interface InputForm {
  email?: string;
  username?: string;
  password?: string;
  passwordConfirmation?: string;
}

export const validPassword = /^(?=.*[A-Z])(?=.*[0-9]).{7,}$/;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormDisplay = function FormDisplay(props: any) {
  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = props;

  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/sign-in');
  };

  React.useEffect(() => {
    if (localStorage.getItem('darkTheme') === 'true') {
      document.body.classList.add('dark-theme');
    }
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginLeft: 300, marginRight: 300, marginTop: 200 }}>
        <Card className="col flex--center-align div--centered p--16">
          <Box className="row flex--center mb--24 mt--8">
            <img
              src={localStorage.getItem('darkTheme') === 'true' ? logo : logoDark}
              alt="logo"
              className="width--40 mr--16"
            />
            <Title className="my--auto" variant="header">
              MyTchat
            </Title>
          </Box>
          <TextField
            classes={{ root: 'mb--16 width--280' }}
            id="email"
            placeholder={t('email')}
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched.email ? t(errors.email) : ''}
            error={touched.email && Boolean(errors.email)}
            variant="outlined"
            fullWidth
          />
          <TextField
            classes={{ root: 'mb--16 width--280' }}
            id="username"
            placeholder={t('username')}
            type="string"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched.username ? t(errors.username) : ''}
            error={touched.username && Boolean(errors.username)}
            variant="outlined"
            fullWidth
          />
          <TextField
            classes={{ root: 'mb--16 width--280' }}
            id="password"
            placeholder={t('password')}
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched.password ? t(errors.password) : ''}
            error={touched.password && Boolean(errors.password)}
            variant="outlined"
            fullWidth
          />
          <TextField
            classes={{ root: 'mb--16 width--280' }}
            id="passwordConfirmation"
            placeholder={t('confirm_password')}
            type="password"
            value={values.passwordConfirmation}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched.passwordConfirmation ? t(errors.passwordConfirmation) : ''}
            error={touched.passwordConfirmation && Boolean(errors.passwordConfirmation)}
            variant="outlined"
            fullWidth
          />
          <Box className="row flex--center mt--8">
            <Button
              className="width--128 mr--8"
              color="secondary"
              onClick={handleNavigate}
              variant="outlined"
            >
              {t('sign_in')}
            </Button>
            <Button
              className="width--128 ml--8"
              type="submit"
              color="primary"
              disabled={isSubmitting}
              variant="contained"
            >
              {t('register')}
            </Button>
          </Box>
        </Card>
      </form>
    </div>
  );
};

const validationSchemaConfig = yup.object({
  email: yup
    .string()
    .email('invalid_email_format')
    .required('email_required'),
  username: yup.string()
    .required('username_required'),
  password: yup
    .string()
    .matches(validPassword, 'invalid_password_format')
    .required('password_required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'password_does_not_match')
    .required('confirm_password_required'),
});

const Form = withFormik<InputForm, InputForm>({
  mapPropsToValues: (props) => ({
    email: props.email || '',
    username: props.username || '',
    password: props.password || '',
    passwordConfirmation: props.passwordConfirmation || '',
  }),

  validationSchema: validationSchemaConfig,

  handleSubmit: (values, { setSubmitting }) => {
    setTimeout(async () => {
      try {
        const res = await
        register(values.email as string, values.password as string, values.username as string);
        if (res?.status === 201) {
          console.log('Youpi');
        }
      } catch (err) {
        throw Error();
      }
      setSubmitting(false);
    }, 100);
  },
})(FormDisplay);

const Register: React.ComponentType<InputForm> = function Register() {
  return <Form />;
};

export default Register;
