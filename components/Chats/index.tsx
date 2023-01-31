/* eslint-disable @next/next/no-img-element */
import { Unsubscribe, User } from "firebase/auth";
import { doc, DocumentData, onSnapshot, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { db } from "../../config/firebaseClient";
import { Users } from "../Users";
import { Navbar } from "../Navbar";
import { v4 as randomKEY } from "uuid";
import styles from "./styles.module.scss";
import { FaUsers } from "react-icons/fa";
import React from "react";
import { Chat } from "../Chat";

const useFirebaseGetChatsFromUsersChatsCollection = () => {
  const [chats, setChats] = useState<DocumentData | undefined>([]);

  const { user: user_Logged_In } = useAuth();
  const { data } = useChat();

  const {
    dispatch,
  }: {
    dispatch: ({
      type,
      payload,
    }: {
      type: "CHANGE_USER" | "CHANGE_USER_TO_NULL";
      payload?: User;
    }) => void;
  } = useChat();

  const getChats: () => Unsubscribe = useCallback(() => {
    return onSnapshot(doc(db, "usersChats", user_Logged_In.uid), (doc) => {
      setChats(doc.data());
    });
  }, [user_Logged_In.uid]);

  useEffect(() => {
    user_Logged_In?.uid && getChats();
  }, [getChats, user_Logged_In.uid]);

  const handleSelect = async (user_selected: User) => {
    dispatch({ type: "CHANGE_USER", payload: user_selected });
  };

  useEffect(() => {
    const setZeroUnreadMessages = async () => {
      data.chatId !== "null" &&
        (await updateDoc(doc(db, "usersChats", user_Logged_In.uid), {
          [data.chatId + ".unread_Messages"]: 0,
        }));
    };

    return () => {
      setZeroUnreadMessages();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.chatId]);

  return {
    chats,
    handleSelect,
  };
};

export const Chats = () => {
  const { chats, handleSelect } = useFirebaseGetChatsFromUsersChatsCollection();
  // const [modalIsOpen, setIsOpen] = React.useState(false);

  // function openModal() {
  //   setIsOpen(true);
  // }
  const { setShowModal, showModal } = useChat();

  // const customStyles = {
  //   overlay: {
  //     position: 'fixed',
  //    top: 0,
  //    left: 0,
  //    bottom: 0,
  //    right: 0,
  //    marginTop: 0,
  //    paddingLeft: 0

  //   },
  //   content: {
  //     width: "100%",
  //     height: "100%",
  //     padding: 0
  //   },
  // };

  return (
    <>
      <Navbar />
      <div className={styles.chats} onClick={() => setShowModal(true)}>
        {chats &&
          Object.entries(chats)
            ?.sort((a, b) => b[1].date - a[1].date)
            .map((chat) => (
              <Users
                chat={chat}
                handleSelect={handleSelect}
                key={randomKEY()}
              />
            ))}

        {(!chats || Object.entries(chats).length === 0) && (
          <div className={styles.search_user_icon}>
            <FaUsers />
          </div>
        )}
      </div>

      {!!showModal && window.screen.width <= 1300 && <Chat />}
    </>
  );
};
