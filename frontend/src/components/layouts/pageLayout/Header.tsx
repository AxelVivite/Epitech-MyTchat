import React from "react";

import {
    AppBar,
    Box,
    IconButton,
    Toolbar
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import Avatar from "components/atoms/Avatar";
import Button from "components/atoms/buttons/Button";
import Title from "components/atoms/typography/Title";

import logo from "assets/logo.png";
import logoDark from "assets/logo-dark.png";

interface HeaderProps {
    handleClickDrawerButton: () => void;
}

const Header = (props: HeaderProps): JSX.Element => {
    const [darkTheme, setDarkTheme] = React.useState<boolean>(false);

    const handleChangeTheme = () => {
        if (!darkTheme)
            document.body.classList.add("dark-theme");
        else 
            document.body.classList.remove("dark-theme");
        setDarkTheme(!darkTheme);
    }

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
                <Button type="button" onClick={handleChangeTheme}>{darkTheme ? "Light" : "Dark"}</Button>
                <Avatar name="Axel" />
            </Toolbar>
        </AppBar >
    );
}

export default Header;