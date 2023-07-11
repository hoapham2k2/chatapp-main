"use client";
import SignalR from "@/utils/signalR";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import InputMessage from "./components/InputMessage/InputMessage";
import MessageView from "./components/MessageView/MessageView";
import IMessage from "@/types/Message";
import CallVideoButton from "./components/CallVideoButton/CallVideoButton";
import CallVideoRequestModal from "./components/Modal/CallVideoRequestModal";
import useModal from "@/hook/useModal";

type Props = {
  params: {
    slug: string;
  };
};

const DetailChat = (props: Props) => {
  const [listMessage, setListMessage] = React.useState<IMessage[]>([]);
  const { slug } = props.params;
  const connection = SignalR.Instance.HubConnection;
  const router = useRouter();
  //hàm thêm tin nhắn vào listMessage
  const addMessage = (message: string, isMe: boolean = false) => {
    setListMessage((prev) => [
      ...prev,
      {
        message,
        isMe,
      },
    ]);
  };
  const [videocallrequest, setvideocallrequest] = React.useState({
    connectionId: "",
    userName: "",
  });
  useEffect(() => {
    if (connection.state !== "Disconnected") {
      connection.on("ReceiveMessageFromAnother", (message) => {
        addMessage(message, false);
      });
      connection.on("ReceiveVideoCallRequest", (message) => {
        console.log("ReceiveVideoCallRequest: ", message);
        setvideocallrequest(message);
        setIsModalOpen(true);
      });

      connection.on("ReceiveVideoCallAccept", (message) => {
        console.log("ReceiveVideoCallAccept: ", message);
        // router.push(`/videocall/${message.connectionId}`);
        window.open(
          `/videocall/${message.connectionId}?myId = ${connection.connectionId}`,
          "_blank"
        );
      });

      connection.on("ReceiveVideoCallReject", (message) => {
        console.log("ReceiveVideoCallReject: ", message);
      });
    }
  }, [connection]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOnClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4  sm:w-full sm:flex sm:flex-col">
      <h1>Detail Chat</h1>
      <MessageView messages={listMessage} />
      <div className="flex">
        <InputMessage descId={slug} addMessage={addMessage} />
        <CallVideoButton descId={slug} />

        {isModalOpen && (
          <CallVideoRequestModal
            descId={videocallrequest.connectionId}
            descName={videocallrequest.userName}
            onClose={handleOnClose}
          />
        )}
      </div>
    </div>
  );
};

export default DetailChat;
