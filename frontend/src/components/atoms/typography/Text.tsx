import React from "react";

type TextVariant = "name"

interface TextProps {
    children: string;
    className?: string;
    variant?: TextVariant;
};

const Text = (props: TextProps) => {
    return (
        <p className={`text ${props.variant && `text--${props.variant}`} ${props.className}`}>
            {props.children}
        </p>
    );
};

export default Text;