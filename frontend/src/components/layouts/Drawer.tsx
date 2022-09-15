import React from "react";
import { Drawer as MuiDrawer } from "@mui/material/";

const Drawer: React.FC = () => {
    const drawer = (
        <>
        </>
    );

    return (
        <>
            <MuiDrawer id="drawer"
                variant="temporary"
                open={/*props.mobileOpen*/}
                onClose={/*props.handleDrawerToggle*/}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": { width: "280px" },
                }}
            >
                {drawer}
            </MuiDrawer>
            <MuiDrawer id="drawer"
                variant="permanent"
                sx={{
                    display: { xs: "none", md: "block" },
                    "& .MuiDrawer-paper": { width: "280px" },
                }}
                open
            >
                {drawer}
            </MuiDrawer>
        </>
    );
};

export default Drawer;