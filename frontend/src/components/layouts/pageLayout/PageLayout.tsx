import React from "react";

import { Box } from "@mui/material";

import Drawer from "./drawer/Drawer";
import Header from "./Header";

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout = (props: PageLayoutProps): JSX.Element => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

    const handleClickDrawerButton = () => {
        setIsDrawerOpen(!isDrawerOpen);
        console.log(isDrawerOpen)
    }

    return (
        <>
            <Drawer handleClickDrawerButton={handleClickDrawerButton} isDrawerOpen={isDrawerOpen} />
            <Box id="main"
                sx={{
                    width: { md: `calc(100% - 280px})` },
                    ml: { md: "280px" }
                }}
            >

                <Header handleClickDrawerButton={handleClickDrawerButton} />
                <Box
                    sx={{
                        margin: "64 auto 0 auto",
                        minHeight: "calc(100vh - 64px)"
                    }}
                >
                    {props.children}
                </Box>
            </Box>
        </>
    );
};

export default PageLayout;