import { useNavigate } from "react-router-dom";
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
import { register } from "../../utils/userManagment";

interface InputForm {
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


const ERRORS_REGISTER = new Map ([
    ["BadEmail", "Mauvais format d'email. Veuillez le modifier et recommencer"],
    ["BadPassword", "Mauvais format de mot de passe. Veuillez le modifier et recommencer"],
    ["EmailTaken", "Cet adresse email est déjà utiliser. Veuillez en utiliser une autre et recommencer"],
]);

const registration = async (email: string, password: string) => {

}

const Form = withFormik<InputForm, InputForm>({
    mapPropsToValues: props => {
        return {
        email: props.email || "",
        password: props.password || "",
        passwordConfirmation: props.passwordConfirmation || ""
      };
    },
    
    validationSchema: validationsForm,

    handleSubmit: (values, { setSubmitting }) => {
      setTimeout(async () => {
        // submit to the server
        //alert(JSON.stringify(values, null, 2));
        try {
        const res = await register(values.email!, values.password!);
        if (res?.status === 200) {
            const navigator = useNavigate();
            navigator('/home');
            //TODO: Here change it with the home page screen when implemented
        } else {
            console.log(res?.status);
            console.log(res?.data);
            let error = res?.data.error;
            alert(ERRORS_REGISTER.get(error));
        }
        } catch (err) {
            console.log(err);
        }
        
        setSubmitting(false);
      }, 100);
    }
  })(form);
  

export default Register;