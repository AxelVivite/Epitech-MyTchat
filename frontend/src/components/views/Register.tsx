import { useNavigate } from "react-router-dom";
import Input from '@mui/material/Input';
import * as React from 'react';
import * as yup from 'yup';
import { withFormik } from "formik";
import {
    Card,
    CardContent,
    CardActions,
    TextField,
    Button
  } from "@mui/material";

interface Input {
    email?: string;
    password?: string;
    passwordConfirmation?: string;
}

 export const validPassword = new RegExp('^(?=.*?[A-Z])(?=.*?[0-9]).{7,}$');

const Register: React.ComponentType<any> = () => {
    //eslint-disable-next-line
    let navigate = useNavigate();
    
    return (
        <Form/>
    );
}
const form = (props: any) => {
        const {
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