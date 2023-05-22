import React, { useState } from "react";

export default function TextInput(){
  const [message, setMessage] = useState("");

  const writeMessage = (e:any) => {
    // function to send typing indicator to server
  };

  return (
    <div className="message_input_wrapper">
      <input
        id="message-text-field"
        className="message_input"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={writeMessage}
      />
    </div>
  );
};
