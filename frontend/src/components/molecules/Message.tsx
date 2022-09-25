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
        <Card>
            <Avatar name={props.username} />
            <Box>
                <Box>
                    <Typography>{props.username}</Typography>
                    <Typography>{props.datetime}</Typography>
                </Box>
                <Typography>{props.message}</Typography>
            </Box>
        </Card>
    );
};

export default Message;