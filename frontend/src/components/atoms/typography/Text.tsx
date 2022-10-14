import React from "react";

type TextVariant = "name"

interface TextProps {
    children: string;
    className?: string;
    variant?: TextVariant;
};

const Text = (props: TextProps) => {
    return (
        <p className={`${(props.variant && `text--${props.variant}`) || "text"} ${props.className}`}>
            {props.children}
        </p>
    );
};

export default Text;