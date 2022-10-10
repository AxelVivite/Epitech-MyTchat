import {
    Box,
    Card
} from "@mui/material";

import Avatar from "../atoms/Avatar";
import Text from "../atoms/typography/Text";
import TextDateTime from "../atoms/typography/TextDateTime";

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
                <Box className="row mb--8">
                    <Text variant="name">{props.username}</Text>
                    <TextDateTime className="ml--8 my--auto width--96">{props.datetime}</TextDateTime>
                </Box>
                <Text>{props.message}</Text>
            </Box>
        </Card>
    );
};

export default Message;