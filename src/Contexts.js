import React, { useState } from 'react';

export const UserContext = React.createContext();
export const TokenContext = React.createContext();


// Message
export const MessageContext = React.createContext();

export const MessageContextProvider = props => {

    const setMessageContent = (messageContent) => {

      console.log("state", state ? "a" : "b", state)
      console.log("new ", messageContent)
      _setState({...state, messageContent: messageContent})
    }
  
    const initState = {
        messageContent: "",
        setMessageContent: setMessageContent,

        setMessageId: id => _setState({...state, messageId: id}),
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