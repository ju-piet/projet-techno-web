import React, { useState } from 'react';

/* La création des contexts */
export const UserContext = React.createContext();
export const TokenContext = React.createContext();


// Le context du message
export const MessageContext = React.createContext();

export const MessageContextProvider = props => {

  const setMessageContent = (messageContent) => {
    _setState({ ...state, messageContent: messageContent })
  }

  const initState = {
    messageContent: "",
    setMessageContent: setMessageContent,

    setMessageId: id => _setState({ ...state, messageId: id }),
    messageId: null,

    setState: state => _setState(state),
  }

  const [state, _setState] = useState(initState)

  return (
    <MessageContext.Provider value={state}>
      {props.children}
    </MessageContext.Provider>
  )
}