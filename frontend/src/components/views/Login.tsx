import { useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as React from 'react';
import { login } from "../../utils/userManagment";
//eslint-disable-next-line
import { setGlobalState, useGlobalState } from "../../utils/globalStateManager/globalStateInit";
import { User, Room } from "../../utils/globalStateManager/globalStateObjects";
import { getRooms } from "../../utils/roomsManagment";

interface State {
    username: string;
    password: string;
    showPassword: boolean;
}

//eslint-disable-next-line
const ERRORS_REGISTER = new Map ([
  ["BadEmail", "Mauvais format d'email. Veuillez le modifier et recommencer"],
  ["BadPassword", "Mauvais format de mot de passe. Veuillez le modifier et recommencer"],
  ["EmailTaken", "Cet adresse email est déjà utiliser. Veuillez en utiliser une autre et recommencer"],
]);

const Login: React.FC = () => {
    let navigate = useNavigate();

    const [values, setValues] = React.useState<State>({
        username: '',
        password: '',
        showPassword: false,
      });

    //eslint-disable-next-line
    const [token, setToken] = React.useState("");
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
    
    const setupGsm = async (res: any) => {
      setGlobalState("token", res?.data.token)
      let user: User = {
        userId: res?.data.userId,
        username: values.username
      }
      setGlobalState("user", user)

      let rooms: any = await getRooms(res?.data.token);
      setGlobalState("rooms",rooms)

    }

    return (
<Box sx={{ display: 'flex', flexWrap: 'wrap', paddingBottom: 200, flexDirection: "column", alignContent: "center", paddingTop: 10 }}>
    
        <FormControl sx={{ m: 1, width: '25ch' }} variant="filled">
          <InputLabel htmlFor="filled-adornment-email">Username</InputLabel>
          <FilledInput
            id="username"
            value={values.username}
            onChange={handleChange('username')}
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
          <Button onClick={ async () => {
                try {
                    const res = await login(values.username, values.password);
                    if (res?.status === 200) {
                        setToken(res?.data.token);
                        await setupGsm(res);
                        navigate(`/home`);
                      }
                    
                } catch (err) {
                    alert(err);
                    console.log(err);
                }
                }}
              >
              Se connecter
          </Button>
          <Button onClick={() => {
              navigate("/register");
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