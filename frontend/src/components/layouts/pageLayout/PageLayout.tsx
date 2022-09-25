import React from "react";

import { Box } from "@mui/material";

import Drawer from "./Drawer";
import Header from "./Header";

import "./PageLayout.styles.scss";

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
                    maxWidth: "1400px",
                    paddingLeft: { md: "296px" },
                    padding: "0 16px",
                    margin: "auto"
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