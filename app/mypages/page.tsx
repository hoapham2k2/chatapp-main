"use client";
import React from "react";

type Props = {};

const MyPage = (props: Props) => {
  const myVideoRef = React.useRef<HTMLVideoElement>(null);
  const localStream = React.useRef<MediaStream>();

  const shareScreenRef = React.useRef<HTMLVideoElement>(null); // this is for share screen (not implement yet)
  const shareScreenStream = React.useRef<MediaStream>(); // this is for share screen (not implement yet)

  // 3 options: camera, mic, share screen
  // camera: turn on/off camera
  // mic: turn on/off mic
  // share screen: share screen
  const [isCameraOn, setIsCameraOn] = React.useState<boolean>(false);
  const [isMicOn, setIsMicOn] = React.useState<boolean>(false);
  const [isShareScreenOn, setIsShareScreenOn] = React.useState<boolean>(false); // not implement yet

  React.useEffect(() => {
    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((stream: MediaStream) => {
    //     if (myVideoRef.current) {
    //       localStream.current = stream;
    //       myVideoRef.current.srcObject = stream;
    //     }
    //   });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: MediaStream) => {
        if (myVideoRef.current) {
          setIsCameraOn(true);
          setIsMicOn(true);
          setIsShareScreenOn(false); // not implement yet (default is false)
          localStream.current = stream;
          myVideoRef.current.srcObject = stream;
        }
      });
  }, []);

  // turn on/off camera
  const handleCameraOnClick = () => {
    console.log("handleCameraOnClick");
    setIsCameraOn(!isCameraOn);
    if (localStream.current) {
      localStream.current.getVideoTracks()[0].enabled = !isCameraOn;
    }
  };

  // turn on/off mic
  const handleMicOnClick = () => {
    console.log("handleMicOnClick");
    setIsMicOn(!isMicOn);
    if (localStream.current) {
      localStream.current.getAudioTracks()[0].enabled = !isMicOn;
    }
  };

  // share screen
  const handleShareScreenOnClick = () => {
    console.log("handleShareScreenOnClick");
    setIsShareScreenOn(!isShareScreenOn);

    if (localStream.current && !isShareScreenOn) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then((stream: MediaStream) => {
          if (shareScreenRef.current) {
            shareScreenStream.current = stream;
            shareScreenRef.current.srcObject = stream;
          }
        });
    }
  };

  return (
    <div>
      <video ref={myVideoRef} autoPlay muted></video>
      {isShareScreenOn ? (
        <div>
          <video
            ref={shareScreenRef}
            className="w-32 h-auto border-2 border-gray-500"
            autoPlay
            muted
          ></video>
        </div>
      ) : (
        <div>Nothing because share scrren is not chosen</div>
      )}
      {/* options button with camera, mic, share screen */}
      <div>
        <button onClick={handleCameraOnClick}>Camera</button>
        <button onClick={handleMicOnClick}>Mic</button>
        <button onClick={handleShareScreenOnClick}>Share Screen</button>
      </div>
    </div>
  );
};

export default MyPage;
