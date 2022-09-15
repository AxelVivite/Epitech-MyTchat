import { useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
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

interface State {
    email: string;
    password: string;
    showPassword: boolean;
}

const Login: React.FC = () => {
    let navigate = useNavigate();

    const [values, setValues] = React.useState<State>({
        email: '',
        password: '',
        showPassword: false,
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
<Box sx={{ display: 'flex', flexWrap: 'wrap', paddingBottom: 200, flexDirection: "column", alignContent: "center", paddingTop: 10 }}>
    
        <FormControl sx={{ m: 1, width: '25ch' }} variant="filled">
          <InputLabel htmlFor="filled-adornment-email">Email</InputLabel>
          <FilledInput
            id="email"
            value={values.email}
            onChange={handleChange('email')}
            endAdornment={<InputAdornment position="end">@</InputAdornment>}
            aria-describedby="filled-weight-helper-text"
            inputProps={{
              'aria-label': 'email',
            }}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: '25ch', paddingBottom: 5 }} variant="filled">
          <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
          <FilledInput
            id="filled-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
          <Button onClick={() => {
              console.log(values.email + " et " + values.password);
              navigate("/test");
            }} 
              variant="outlined"
              > 
              Se connecter
          </Button>
          <Button onClick={() => {
            //   console.log(values.email + " et " + values.password);
            //   navigate("/test");
            }} 
              variant="outlined"
              sx={{marginTop: 3}}
              > 
              S'enregistrer
          </Button>
    </Box>
    );
};

export default Login;