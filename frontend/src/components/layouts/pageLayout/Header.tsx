import React from "react";

import {
    AppBar,
    Box,
    IconButton,
    Toolbar
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import Button from "components/atoms/buttons/Button";
import Title from "components/atoms/typography/Title";
import AvatarMenu from "components/layouts/pageLayout/AvatarMenu";

import logo from "assets/logo.png";
import logoDark from "assets/logo-dark.png";

interface HeaderProps {
    handleClickDrawerButton: () => void;
}

const Header = (props: HeaderProps): JSX.Element => {
    const darkTheme = localStorage.getItem("darkTheme") === "false";

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
                    <img src={darkTheme ? logo : logoDark} alt="logo" className="width--40 mr--16" />
                    <Title className="my--auto" variant="header">
                        RoomName
                    </Title>
                </Box>
                <AvatarMenu />
            </Toolbar>
        </AppBar >
    );
}

export default Header;