import React from "react";

import { 
    AppBar,
    Avatar,
    IconButton,
    Toolbar,
    Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import getInitials from "../../utils/getInitials";

const Header: React.FC = () => {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <IconButton>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    MyChat
                </Typography>
                <Avatar>
                    {getInitials("Axel Virot")}
                </Avatar>
            </Toolbar>
        </AppBar>
    );
}

export default Header;