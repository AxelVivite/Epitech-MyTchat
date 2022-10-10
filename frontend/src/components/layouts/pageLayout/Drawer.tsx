import { useTranslation } from "react-i18next";

import {
    Box,
    Drawer as MuiDrawer
} from "@mui/material/";
import AddIcon from '@mui/icons-material/Add';

import Title from "../../atoms/typography/Title";

import Modal from "../../molecules/Modal";
import Rooms from "../../molecules/Rooms";

interface DrawerProps {
    handleClickDrawerButton: () => void;
    isDrawerOpen: boolean;
}

const Drawer = (props: DrawerProps): JSX.Element => {
    const { t } = useTranslation();

    const drawer = (
        <>
            <Box className="row border--bottom p--16 height--32 flex--space-between">
                <Title className="line-height--32" variant="room">
                    {t("rooms")}
                </Title>
                <Modal
                    buttonLabel={<AddIcon />}
                    clickableVariant="iconButton"
                >
                    <p>Hello</p>
                </Modal>
            </Box>
            <Rooms />
        </>
    );

    return (
        <>
            <MuiDrawer id="drawer"
                variant="temporary"
                open={props.isDrawerOpen}
                onClose={props.handleClickDrawerButton}
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
            >
                {drawer}
            </MuiDrawer>
        </>
    );
};

export default Drawer;