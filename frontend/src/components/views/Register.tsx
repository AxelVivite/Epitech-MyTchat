import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { withFormik } from "formik";
import {
    withStyles,
    Card,
    CardContent,
    CardActions,
    TextField,
    MenuItem,
    Button
  } from "@mui/material";

interface State {
    email: string;
    password: string;
    passwordConfirmation: string;
    showPassword: boolean;
    formIsValid: boolean;
    emailIsValid: boolean;
}

interface Input {
    email?: string;
    password?: string;
    passwordConfirmation?: string;
}

 export const validPassword = new RegExp('^(?=.*?[A-Z])(?=.*?[0-9]).{7,}$');

const Register: React.ComponentType<any> = () => {
    let navigate = useNavigate();
    

    const validationSchema = yup.object({
        email: yup
             .string()
             .email('Entrer un email valide')
             .required('Email obligatoire'),    
        password: yup
            .string()
            .matches(validPassword, "Le mot de passe doit contenir au moins une majuscule et 1 chiffre")
            .required("Mot de passe obligatoire"),
        passwordConfirmation: yup
            .string()
            .oneOf([yup.ref('password'), null], "Les mots de passe ne correspondent pas")
            .required("La validation de mot de passe et obligatoire")
       });

    const [values, setValues] = React.useState<State>({
        email: '',
        password: '',
        passwordConfirmation: '',
        showPassword: false,
        formIsValid: false,
        emailIsValid: false,
      });

      const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
          passwordConfirmation: ''
        },
        validationSchema: validationSchema ,    
        onSubmit: values => {  
            console.log(values);
        },
    });
    
      const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
          setValues({ ...values, [prop]: event.target.value });
        };

      const handleClickShowPassword = () => {
        setValues({
          ...values,
          showPassword: !values.showPassword,
        });
      };
    
      const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      };
    return (
        <Form/>
    );
}
const form = (props: any) => {
        const {
          classes,
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset
        } = props;
      

    return (
    <div>
      <form onSubmit={handleSubmit} style={{marginLeft: 300, marginRight: 300, marginTop: 200}}>
        <Card>
          <CardContent>
            <TextField
              id="email"
              label="Email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.email ? errors.email : ""}
              error={touched.email && Boolean(errors.email)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.password ? errors.password : ""}
              error={touched.password && Boolean(errors.password)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="passwordConfirmation"
              label="Confirm Password"
              type="password"
              value={values.passwordConfirmation}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.passwordConfirmation ? errors.passwordConfirmation : ""}
              error={touched.passwordConfirmation && Boolean(errors.passwordConfirmation)}
              margin="dense"
              variant="outlined"
              fullWidth
            />
          </CardContent>
          <CardActions>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              S'enregistrer
            </Button>
            <Button color="secondary" onClick={handleReset}>
              Effacer
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
    );
};


const validationsForm = yup.object({
    email: yup
         .string()
         .email('Entrer un email valide')
         .required('Email obligatoire'),    
    password: yup
        .string()
        .matches(validPassword, "Le mot de passe doit contenir au moins 7 charactére avec au minimum une majuscule et 1 chiffre")
        .required("Mot de passe obligatoire"),
    passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password')], "Les mots de passe ne correspondent pas")
        .required("La validation de mot de passe et obligatoire")
   });

// const validationsForm = {
//     email: yup
//          .string()
//          .email('Entrer un email valide')
//          .required('Email obligatoire'),    
//     password: yup
//         .string()
//         .length(7, "Le mot de passe doit contenir au moins 7 charactére")
//         .matches(validPassword, "Le mot de passe doit contenir au moins une majuscule et 1 chiffre")
//         .required("Mot de passe obligatoire"),
//     passwordConfirmation: yup
//         .string()
//         .oneOf([yup.ref('password'), null], "Les mots de passe ne correspondent pas")
//         .required("La validation de mot de passe et obligatoire")
// };

const Form = withFormik<Input, Input>({
    mapPropsToValues: props => {
        return {
        email: props.email || "",
        password: props.password || "",
        passwordConfirmation: props.passwordConfirmation || ""
      };
    },
    
    validationSchema: validationsForm,
  
    handleSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        // submit to the server
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 1000);
    }
  })(form);
  

export default Register;