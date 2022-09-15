import React from "react";

import Drawer from "./Drawer";
import Header from "./Header";

const PageLayout: React.FC = (children) => {
    return (
        <>
            <Drawer />
            <Header />
            {children}
        </>
    );
};

export default PageLayout;