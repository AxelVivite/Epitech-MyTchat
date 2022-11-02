import React from "react";

import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import Avatar from "../../atoms/Avatar";
import logo from "../../../assets/logo.png";
import { useGlobalState } from "../../../utils/globalStateManager/globalStateInit";

interface HeaderProps {
    handleClickDrawerButton: () => void;
}

const Header = (props: HeaderProps): JSX.Element => {
    let { setState, state} = useGlobalState();

    return (
        <AppBar position="sticky" className="mb--16">
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <IconButton onClick={props.handleClickDrawerButton}
                    color="secondary"
                    sx={{
                        display: { xs: "block", md: "none" }
                    }}>
                    <MenuIcon />
                </IconButton>
                <Box className="row">
                    <img src={logo} alt="logo" style={{ width: "40px", marginRight: "16px" }}/>
                    <Typography className="title" >
                        MyChat - 
            <text>{" " + state.user?.username}</text>
                    </Typography>
                </Box>
                <Avatar name="Axel" />
            </Toolbar>
        </AppBar >
    );
}

export default Header;