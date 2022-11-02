import React from "react";

interface TextDateTimeProps {
    children: string;
    className?: string;
}

const TextDateTime = (props: TextDateTimeProps) => {
    return (
        <p className={`datetime ${props.className}`}>
            {props.children}
        </p>
    );
};

export default TextDateTime;