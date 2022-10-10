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
        <Card className={`row p--16 mb--16 mr--16 tchat--message ${props.username === "Axel" && "ml--auto"}`}>
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

/*const Message = (props: MessageProps): JSX.Element => {
    return (
        <Box className={`row ${props.username === "Axel" && "flex--end"}`}>
            {props.username !== "Axel" &&
                <Avatar name={props.username} className="mr--16" />
            }
            <Card className="row p--16 mb--16 width--70">
                <Box className="col m--0 flex-grow--1">
                    <Box className="row">
                        <Typography className="name">{props.username}</Typography>
                        <Typography className="datetime">{props.datetime}</Typography>
                    </Box>
                    <Typography className="message">{props.message}</Typography>
                </Box>
            </Card>
        </Box>
    );
};*/

export default Message;