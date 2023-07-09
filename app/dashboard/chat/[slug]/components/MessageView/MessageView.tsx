"use client";

import IMessage from "@/types/Message";
import React, { useEffect } from "react";

type Props = {
  messages: IMessage[];
};

const MessageView = (props: Props) => {
  // 1 useRef ở message view để scroll xuống cuối cùng khi có tin nhắn mới
  const messageEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    // 2 useEffect để scroll xuống cuối cùng khi có tin nhắn mới
    [props.messages]
  );

  return (
    <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
      {
        //hiển thị listMessage
        props.messages.map((message, index) => {
          if (message.isMe) {
            return (
              <div key={index} className="flex justify-end">
                <div className="bg-blue-500 text-white p-2 rounded  max-w-[30%] break-all">
                  {message.message}
                </div>
              </div>
            );
          } else {
            return (
              <div key={index} className="flex justify-start">
                <div className="bg-gray-300 text-gray-800 p-2 rounded  max-w-[30%] break-all">
                  {message.message}
                </div>
              </div>
            );
          }
        })
      }
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageView;
