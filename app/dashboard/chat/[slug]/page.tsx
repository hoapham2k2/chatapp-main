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
import CallWaitingModal from "./components/Modal/CallWaitingModal";

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
          `/videocall/${message.connectionId}?myId=${connection.connectionId}
        `,
          "This is from receiver",
          "width=800,height=600,top=0,right=0" // <- This is what makes it open in a new window with the specified dimensions and position (top, left, etc.)
        );
        setIsCallWaiting(false);
      });

      connection.on("ReceiveVideoCallReject", (message) => {
        console.log("ReceiveVideoCallReject: ", message);
        setIsCallWaiting(false);
      });
    }
  }, [connection]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCallWaiting, setIsCallWaiting] = React.useState(false);
  const handleOnCloseModalRespone = () => {
    setIsModalOpen(false);
  };

  const handleOnCloseModelRequest = () => {
    setIsCallWaiting(false);
  };

  const setIsCallWaitingTrue = () => {
    setIsCallWaiting(true);
  };

  return (
    <div className="px-4 w-full h-full flex flex-col">
      <h1 className="uppercase font-bold border-b py-2 mb-2">Detail Chat</h1>
      <MessageView messages={listMessage} />
      <div className="p-2 pb-16 sm:pb-2 flex gap-2">
        <InputMessage descId={slug} addMessage={addMessage} />
        <CallVideoButton
          descId={slug}
          setIsCallWaitingTrue={setIsCallWaitingTrue}
        />

        {isModalOpen && (
          <CallVideoRequestModal
            descId={videocallrequest.connectionId}
            descName={videocallrequest.userName}
            onClose={handleOnCloseModalRespone}
          />
        )}
        {isCallWaiting && (
          <CallWaitingModal
            descId={videocallrequest.connectionId}
            descName={videocallrequest.userName}
            onClose={handleOnCloseModelRequest}
          />
        )}
      </div>
    </div>
  );
};

export default DetailChat;
