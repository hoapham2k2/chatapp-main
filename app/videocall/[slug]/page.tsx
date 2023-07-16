"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Peer, { DataConnection } from "peerjs";
import React, { useEffect } from "react";
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsMicFill,
  BsMicMuteFill,
} from "react-icons/bs";
import { PiScreencastBold } from "react-icons/pi";
import { MdOutlineStopScreenShare } from "react-icons/md";
import { BsArrowReturnLeft } from "react-icons/bs";

type Props = {
  params: {
    slug: string;
  };
};

const VideoCallPage = (props: Props) => {
  const descId = props.params.slug;
  // `/videocall/${props.descId}?myId=${connection.connectionId} are the types of params that we want to pass to the url
  const [myId, setMyId] = React.useState<string>(""); // myId is the id of the caller
  const router = useRouter(); // router.query.slug is the id of the receiver
  const searchParams = useSearchParams();

  const myid = searchParams.get("myId"); // set myid to the id of the caller (from the url)
  const peerInstance = React.useRef<Peer>(); // peerInstance is the instance of the caller

  const myVideoRef = React.useRef<HTMLVideoElement>(null); // myVideoRef is the video of the caller
  const descVideoRef = React.useRef<HTMLVideoElement>(null); // descVideoRef is the video of the receiver
  //a stream video screen share
  const shareScreenRef = React.useRef<HTMLVideoElement>(null); // this is for share screen (not implement yet)
  const shareScreenStream = React.useRef<MediaStream>(); // this is for share screen (not implement yet)
  let localStream = React.useRef<MediaStream>(); // localStream is the stream of the caller
  let descStream = React.useRef<MediaStream>(); // descStream is the stream of the receiver
  let peerJSConnection = React.useRef<DataConnection>();
  // peerJSConnection is the connection between the caller and the receiver

  const [isCameraOn, setIsCameraOn] = React.useState<boolean>(true); // isCameraOn is the state of the camera of the caller
  const [isMicOn, setIsMicOn] = React.useState<boolean>(true); // isMicOn is the state of the mic of the caller
  const [isShareScreenOn, setIsShareScreenOn] = React.useState<boolean>(false); // isShareScreenOn is the state of the share screen of the caller (not implement yet)

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

      //get stream from caller (myself)
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream: MediaStream) => {
          if (myVideoRef.current) {
            localStream.current = stream;
            myVideoRef.current.srcObject = localStream.current;
          }

          const call = peer.call(descId, stream, {
            metadata: { type: "video-call" }, // gửi metadata để nhận biết đây là call video hay call screen share
          });
          peerJSConnection.current = peer.connect(descId); // tạo connection với người nhận
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
            localStream.current = stream;
            myVideoRef.current.srcObject = localStream.current;
          }

          // trả lời call video
          call.answer(stream);

          // nhận stream từ người gọi
          call.on("stream", (remoteStream: MediaStream) => {
            console.log("remoteStream", remoteStream);
            console.log("localStream", localStream);
            console.log("metadata", call.metadata);

            if (call.metadata.type === "screen-share") {
              if (shareScreenRef.current && descVideoRef.current) {
                // bật share screen
                setIsShareScreenOn(true);
                // shareScreenStream.current = remoteStream;
                shareScreenRef.current.srcObject =
                  descStream.current as any as MediaStream; // set stream cho video của người nhận
                descVideoRef.current.srcObject = remoteStream; // set stream cho video của người nhận
              }
            }
            if (call.metadata.type === "video-call") {
              if (descVideoRef.current) {
                descStream.current = remoteStream;
                descVideoRef.current.srcObject = descStream.current;
              }
            }
          });
        })
        .catch((err) => {
          console.log("Failed to get local stream", err);
        });
    });

    // nhận yêu cầu call screen share
    peer.on("connection", (conn) => {
      console.log("conn", conn);
      conn.on("data", (data) => {
        console.log("data", data);
        //lắng nghe tắt share screen
        if (data === "stop-share-screen") {
          console.log("stop-share-screen");

          if (shareScreenRef.current && descVideoRef.current) {
            shareScreenRef.current.srcObject = null;
            descVideoRef.current.srcObject =
              descStream.current as any as MediaStream; // set stream cho video của người nhận
          }

          setIsShareScreenOn(false);
        }

        if (data === "stop-camera") {
          //lắng nghe tắt camera của người nhận
          console.log("stop-camera");
          if (descVideoRef.current) {
            descVideoRef.current.srcObject = null;
          }
        }

        if (data === "start-camera") {
          //lắng nghe bật camera của người nhận
          console.log("start-camera");
          if (descVideoRef.current) {
            descVideoRef.current.srcObject =
              descStream.current as any as MediaStream;
          }
        }

        if (data === "end-call") {
          window.close();
        }
      });
    });

    return () => {
      if (peerInstance.current) {
        peerInstance.current.destroy();
      }
      if (localStream.current) {
        localStream.current.getTracks().forEach((track: any) => track.stop());
      }
      if (descStream.current) {
        descStream.current.getTracks().forEach((track: any) => track.stop());
      }

      if (shareScreenStream.current) {
        shareScreenStream.current
          .getTracks()
          .forEach((track: any) => track.stop());
      }
    };
  }, []);

  const handleOnShareScreenClick = () => {
    setIsShareScreenOn(!isShareScreenOn);
    if (!isShareScreenOn) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then((stream: MediaStream) => {
          if (shareScreenRef.current) {
            shareScreenStream.current = stream;
            shareScreenRef.current.srcObject = stream;

            //tiến hành call video
            const call = peerInstance.current?.call(descId, stream, {
              metadata: { type: "screen-share" }, // gửi metadata để nhận biết đây là call video hay call screen share
            });
          }
        })
        .catch((err) => {
          console.log("Failed to get local stream", err);
        });
    } else {
      if (shareScreenStream.current) {
        shareScreenStream.current
          .getTracks()
          .forEach((track: any) => track.stop());

        //thông báo cho người nhận là mình đã tắt share screen
        if (peerJSConnection.current) {
          peerJSConnection.current.send("stop-share-screen");
        } else {
          console.log("peerJSConnection not found");
        }
      }
    }
  };

  const handleOnCameraClick = () => {
    setIsCameraOn(!isCameraOn);

    if (localStream.current && peerJSConnection.current) {
      if (isCameraOn) {
        localStream.current.getVideoTracks()[0].enabled = false;
        peerJSConnection.current.send("stop-camera");
      } else {
        localStream.current.getVideoTracks()[0].enabled = true;
        peerJSConnection.current.send("start-camera");
      }
    }
  };

  const handleOnMicClick = () => {
    setIsMicOn(!isMicOn);

    if (localStream.current) {
      if (isMicOn) {
        localStream.current.getAudioTracks()[0].enabled = false;
      } else {
        localStream.current.getAudioTracks()[0].enabled = true;
      }
    }
  };

  const handleOnEndCallClick = async () => {
    //thông báo cho người nhận là mình đã rời khỏi cuộc gọi
    if (peerJSConnection.current) {
      peerJSConnection.current.send("end-call");
    } else {
      console.log("peerJSConnection not found");
    }

    //sử dụng window (trình duyệt) để tắt tab hiện tại
    await window.close();
  };

  return (
    <div className="video-container w-screen h-screen relative">
      <video ref={descVideoRef} className="h-full ml-auto mr-auto " autoPlay />
      <video
        ref={myVideoRef}
        className="w-1/4 h-1/4 absolute bottom-0 right-0 mb-10 border-2 border-white"
        autoPlay
      />
      <video
        ref={shareScreenRef}
        className={`w-1/4 h-auto absolute bottom-0 left-0 mb-10 `}
        autoPlay
      />

      <div className="video-option flex gap-6 absolute bottom-0 left-1/2 mb-5 transform -translate-x-1/2">
        <div className="p-3 rounded-full border-2">
          {isCameraOn ? (
            <BsCameraVideoFill
              className={`w-[2rem] h-auto`}
              onClick={handleOnCameraClick}
            />
          ) : (
            <BsCameraVideoOffFill
              className={`w-[2rem] h-auto`}
              onClick={handleOnCameraClick}
            />
          )}
        </div>

        <div className="p-3 rounded-full border-2">
          {isMicOn ? (
            <BsMicFill
              className={`w-[2rem] h-auto`}
              onClick={handleOnMicClick}
            />
          ) : (
            <BsMicMuteFill
              className={`w-[2rem] h-auto`}
              onClick={handleOnMicClick}
            />
          )}
        </div>
        <div className="p-3 rounded-full border-2">
          {/* <input
            type="checkbox"
            checked={isShareScreenOn}
            onChange={() => {
              handleOnShareScreenClick();
            }}
            name="share-screen"
          />
          <label htmlFor="share-screen">Share Screen</label> */}
          {isShareScreenOn ? (
            <PiScreencastBold
              className={`w-[2rem] h-auto`}
              onClick={handleOnShareScreenClick}
            />
          ) : (
            <MdOutlineStopScreenShare
              className={`w-[2rem] h-auto`}
              onClick={handleOnShareScreenClick}
            />
          )}
        </div>

        <div className="p-3 rounded-full border-2">
          <BsArrowReturnLeft
            className={`w-[2rem] h-auto`}
            onClick={handleOnEndCallClick}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;
