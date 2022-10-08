import {
    Box,
    Card,
    Typography
} from "@mui/material";

import Avatar from "../atoms/Avatar";

interface MessageProps {
    username: string;
    datetime: string;
    message: string;
}

const Message = (props: MessageProps): JSX.Element => {
    return (
        <Card className="row p--16 mb--16">
            <Avatar name={props.username} className="mr--16" />
            <Box className="col flex-grow--1">
                <Box className="row">
                    <Typography className="name">{props.username}</Typography>
                    <Typography className="datetime">{props.datetime}</Typography>
                </Box>
                <Typography className="message">{props.message}</Typography>
            </Box>
        </Card>
    );
};

export default Message;