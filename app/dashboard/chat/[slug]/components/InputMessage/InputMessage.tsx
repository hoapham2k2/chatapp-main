"use client";
import SignalR from "@/utils/signalR";
import React from "react";

type Props = {
  descId: string;
  addMessage: (message: string, isMe: boolean) => void;
};

const InputMessage = (props: Props) => {
  const [message, setMessage] = React.useState<string>("");
  const handleOnSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const descId = props.descId;
    const message = e.currentTarget.message.value;

    SignalR.Instance.HubConnection.invoke("SendMessageToUser", descId, message);
    props.addMessage(message, true);

    setMessage("");
  };
  return (
    <form
      onSubmit={handleOnSendMessage}
      className="flex-1 [&>input]:text-black flex gap-1"
    >
      <input
        type="text"
        className="flex-1 rounded-lg border-2 border-gray-300 px-2 py-1"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="[&:disabled]:bg-gray-300 [&:enabled]:bg-blue-500 px-2 py-1 rounded-lg"
        disabled={!message}
      >
        Send
      </button>
    </form>
  );
};

export default InputMessage;
