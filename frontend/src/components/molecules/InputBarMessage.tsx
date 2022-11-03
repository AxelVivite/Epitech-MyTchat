import React from 'react';

import TextField from '@mui/material/TextField';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

import IconButton from '../atoms/buttons/IconButton';

interface InputBarMessageProps {
    onSubmit?: () => void;
}

function InputBarMessage(props: InputBarMessageProps): JSX.Element {
  const handleSendMessage = (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={props.onSubmit} className="row">
      <TextField
        className="flex-grow--1"
        multiline
        maxRows={4}
        placeholder="Message"
        variant="outlined"
      />
      <IconButton
        className="input-bar--btn"
        onKeyDown={handleSendMessage}
        onClick={handleSendMessage}
        type="submit"
        variant="outlined"
      >
        <KeyboardReturnIcon />
      </IconButton>
    </form>
  );
}

export default InputBarMessage;
