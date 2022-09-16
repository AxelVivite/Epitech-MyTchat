import React from "react";

import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Toolbar,
    Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import getInitials from "../../../utils/getInitials";
import logo from "../../../assets/logo.png";

interface HeaderProps {
    handleClickDrawerButton: () => void;
}

const Header = (props: HeaderProps): JSX.Element => {
    return (
        <AppBar position="sticky">
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <IconButton onClick={props.handleClickDrawerButton}
                    sx={{
                        display: { xs: "block", md: "none" }
                    }}>
                    <MenuIcon />
                </IconButton>
                <Box sx={{ display: "flex", flexWrap: "nowrap", flexDirection: "row" }}>
                    <img src={logo} alt="logo" style={{ width: "40px" }}/>
                    <Typography variant="h6" component="div" >
                        MyChat
                    </Typography>
                </Box>
                <Avatar>
                    {getInitials("Axel Virot")}
                </Avatar>
            </Toolbar>
        </AppBar >
    );
}

export default Header;