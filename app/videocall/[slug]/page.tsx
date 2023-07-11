"use client";
import { RootState } from "@/features/store";
import SignalR from "@/utils/signalR";
import { HubConnection } from "@microsoft/signalr";
import { useRouter, useSearchParams } from "next/navigation";
import Peer from "peerjs";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

type Props = {
  params: {
    slug: string;
  };
};

const VideoCallPage = (props: Props) => {
  const descId = props.params.slug;
  const [myId, setMyId] = React.useState<string>("");
  const router = useRouter();

  // `/videocall/${props.descId}?myId=${connection.connectionId}
  //     `,

  const searchParams = useSearchParams();

  const myid = searchParams.get("myId");

  const peerInstance = React.useRef<Peer>();
  const myVideoRef = React.useRef<HTMLVideoElement>(null);
  const descVideoRef = React.useRef<HTMLVideoElement>(null);
  let localStream: any = null;
  let remoteStream: any = null;

  useEffect(() => {
    const peer = new Peer(
      `${myid ? myid : Math.floor(Math.random() * 1000000000)}`,
      {
        host: "0.peerjs.com",
        port: 443,
      }
    );

    peerInstance.current = peer;

    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      setMyId(id);

      //tạo stream cho video local
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream: MediaStream) => {
          if (myVideoRef.current) {
            localStream = stream;
            myVideoRef.current.srcObject = stream;
          }

          // gửi yêu cầu call video
          const call = peer.call(descId, stream);

          // nhận stream từ người gọi
          call.on("stream", (remoteStream: MediaStream) => {
            if (descVideoRef.current) {
              remoteStream = remoteStream;
              descVideoRef.current.srcObject = remoteStream;
            }
          });
        })
        .catch((err) => {
          console.log("Failed to get local stream", err);
        });
    });

    // nhận yêu cầu call video
    peer.on("call", (call) => {
      // lấy stream từ người gọi
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream: MediaStream) => {
          if (myVideoRef.current) {
            localStream = stream;
            myVideoRef.current.srcObject = stream;
          }

          // trả lời call video
          call.answer(stream);

          // nhận stream từ người gọi
          call.on("stream", (remoteStream: MediaStream) => {
            if (descVideoRef.current) {
              remoteStream = remoteStream;
              descVideoRef.current.srcObject = remoteStream;
            }
          });
        })
        .catch((err) => {
          console.log("Failed to get local stream", err);
        });
    });

    return () => {
      if (peerInstance.current) {
        peerInstance.current.destroy();
      }
      if (localStream) {
        localStream.getTracks().forEach((track: any) => track.stop());
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach((track: any) => track.stop());
      }
    };
  }, [
    descId,
    myid,
    myVideoRef.current,
    descVideoRef.current,
    peerInstance.current,
  ]);

  return (
    <div className="video-container w-screen h-screen relative">
      <video ref={descVideoRef} className="h-full ml-auto mr-auto " autoPlay />
      <video
        ref={myVideoRef}
        className="w-1/4 h-1/4 absolute bottom-0 right-0 mb-10"
        autoPlay
      />
      <div className="video-option flex absolute bottom-0 left-1/2 mb-5 transform -translate-x-1/2">
        <button className="btn btn-primary">Mute</button>
        <button className="btn btn-primary">Stop Video</button>
        <button className="btn btn-primary">Leave</button>
      </div>
    </div>
  );
};

export default VideoCallPage;
