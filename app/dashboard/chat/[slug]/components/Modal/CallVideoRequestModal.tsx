"use client";
import SignalR from "@/utils/signalR";
import { HubConnection } from "@microsoft/signalr";
import { useRouter } from "next/navigation";
import React from "react";
import ReactDOM from "react-dom";

type Props = {
  descId: string;
  descName: string;

  onClose?: () => void;
};

const CallVideoRequestModal = (props: Props) => {
  const connection: HubConnection = SignalR.Instance.HubConnection;
  const router = useRouter();
  const handleCall = () => {
    connection.invoke("SendVideoCallAccept", props.descId);
    if (props.onClose) {
      props.onClose();
      // router.push(`/videocall/${props.descId}`);
      // window open with 800x600 and center of screen
      window.open(
        `/videocall/${props.descId}?myId=${connection.connectionId}
      `,
        "this is from caller",
        "width=800,height=600,top=0,left=0" // <- This is what makes it open in a new window with the specified dimensions and position (top, left, etc.)
      );
    }
  };

  const handleCancel = () => {
    connection.invoke("SendVideoCallReject", props.descId);

    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  Video Call Request
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Do you want to call video with user {props.descName}?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleCall}
            >
              Call
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CallVideoRequestModal;
