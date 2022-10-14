import React from "react";

import {
    AppBar,
    Box,
    IconButton,
    Toolbar
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import Avatar from "../../atoms/Avatar";
import Title from "../../atoms/typography/Title";

import logo from "../../../assets/logo.png";

interface HeaderProps {
    handleClickDrawerButton: () => void;
}

const Header = (props: HeaderProps): JSX.Element => {
    return (
        <AppBar position="sticky" className="mb--16">
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <IconButton onClick={props.handleClickDrawerButton}
                    sx={{
                        display: { xs: "block", md: "none" }
                    }}>
                    <MenuIcon />
                </IconButton>
                <Box className="row">
                    <img src={logo} alt="logo" className="width--40 mr--16" />
                    <Title className="my--auto" variant="header">
                        RoomName
                    </Title>
                </Box>
                <Avatar name="Axel" />
            </Toolbar>
        </AppBar >
    );
}

export default Header;