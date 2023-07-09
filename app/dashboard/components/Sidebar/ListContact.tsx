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

  return (
    <div className="flex-1  ">
      {listContact &&
        listContact.map((user, index) => (
          <Link
            key={user.connectionId}
            href={`/dashboard/chat/${user.connectionId}`}
          >
            <UserButton userName={user.userName} />
          </Link>
        ))}
    </div>
  );
};

export default ListContact;
