import React from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '@mui/material/TextField';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

import { sendMessage } from '../../utils/roomsManagment';
import { useGlobalState } from '../../utils/globalStateManager/globalStateInit';
import IconButton from '../atoms/buttons/IconButton';
import { Post } from '../../utils/globalStateManager/globalStateObjects';

interface InputBarMessageProps {
  onSubmit: () => void | undefined,
  messages: Post[],
  setMessages: React.Dispatch<React.SetStateAction<Post[]>>,

}

const InputBarMessage = function InputBarMessage({
  // eslint-disable-next-line no-unused-vars
  onSubmit,
  messages,
  setMessages,
}: InputBarMessageProps) {
  const { t } = useTranslation();
  const { state } = useGlobalState();

  const formReducer = (formState: any, event: any) => ({
    ...formState,
    target: event.target.value,
  });
  const [formData, setFormData] = React.useReducer(formReducer, {});

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
  ): Promise<void> => {
    // event: FormEventHandler<HTMLFormElement>,
    event.preventDefault();
    const statSend = await sendMessage(
state.token as string,
formData.target,
state.activeRoom as string,
    );
    if (statSend) {
      const msgTmp = messages;
      const newMsg: Post = {
        message: formData,
        sender: {
          username: state.user?.username as string,
          userId: state.user?.userId as string,
        },
        messageDate: new Date().toString(),
      };
      msgTmp.push(newMsg);
      setMessages(msgTmp);
    }
    // setTimeout(() => {
    //   setSubmitting(false);
    // }, 3000);
  };
  // const handleSendMessage = (
  //   event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
  // ) => {
  //   event.preventDefault();
  // };

  return (
    // <form onSubmit={onSubmit} className="row">
    <div>
      <TextField
        className="flex-grow--1"
        multiline
        maxRows={4}
        placeholder={t('Message')}
        variant="outlined"
        onChange={setFormData}
      />
      <IconButton
        className="input-bar--btn"
        onKeyDown={handleSubmit}
        onClick={handleSubmit}
        type="submit"
        variant="outlined"
      >
        <KeyboardReturnIcon />
      </IconButton>
    </div>
    // </form>
  );
};

export default InputBarMessage;
