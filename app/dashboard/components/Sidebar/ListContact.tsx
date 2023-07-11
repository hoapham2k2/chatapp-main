"use client";
import UserButton from "@/app/components/Button/UserButton";
import { RootState } from "@/features/store";
import { IUserConnection } from "@/types/UserConnection";
import SignalR from "@/utils/signalR";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

type Props = {};

const ListContact = (props: Props) => {
  const myList = useSelector((state: RootState) => state.users.users);
  const connection = SignalR.Instance.HubConnection;
  const [listContact, setListContact] = React.useState<IUserConnection[]>([]);
  const router = useRouter();
  // 1 biến để lưu trạng thái của phần tử đang được chọn trong listContact
  const [selected, setSelected] = React.useState<string>("");

  useEffect(() => {
    if (connection.state === "Disconnected") {
      router.push("/");
    }
  }, [connection]);

  useEffect(() => {
    if (connection && myList) {
      //listContact se bang myList sau khi da loai bo user dang login (user chua co connectionId)
      setListContact(
        myList.filter((user) => user.connectionId !== connection.connectionId)
      );
      console.log("ListContact: ", listContact);

      console.log("myList: ", myList);
    }
  }, [myList]);

  useEffect(() => {
    if (listContact && listContact.length > 0) {
      //set selected = connectionId cua phan tu dau tien trong listContact
      setSelected(listContact[0].connectionId);
      router.push(`/dashboard/chat/${listContact[0].connectionId}`);
    }
  }, [listContact]);

  // 1 hàm để xử lý sự kiện click vào phần tử trong listContact
  const handleOnClickSelectedUser = (connectionId: string) => () => {
    setSelected(connectionId);
    router.push(`/dashboard/chat/${connectionId}`);
  };

  return (
    <div className="flex-1  ">
      {/* {listContact &&
        listContact.map((user, index) => (
          <Link
            key={user.connectionId}
            href={`/dashboard/chat/${user.connectionId}`}
          >
            <UserButton userName={user.userName} />
          </Link>
        ))} */}
      {/* Liệt kê danh sách list contact của user và chọn phần tử đầu tiên trong listContact */}
      {listContact &&
        listContact.map((user, index) => (
          <div key={user.connectionId} className="flex flex-col">
            <button
              className={`${
                selected === user.connectionId
                  ? "bg-gray-300 text-gray-700"
                  : "text-gray-500 hover:bg-gray-300 hover:text-gray-700"
              } flex items-center px-4 py-2 text-sm font-medium rounded-md`}
              onClick={handleOnClickSelectedUser(user.connectionId)}
            >
              {user.userName}
            </button>
          </div>
        ))}
    </div>
  );
};

export default ListContact;
