/* eslint-disable @next/next/no-img-element */
import { updateDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";
import { db } from "../../../config/firebaseClient";
import { Input } from "../Input";
import { Messages } from "../Messages";
import styles from "./styles.module.scss";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { HiArrowSmLeft } from "react-icons/hi";

export const Chat = () => {
  const { data } = useChat();
  const { user: user_Logged_In } = useAuth();

  const { setShowModal } = useChat();

  // const [modalIsOpen, setIsOpen] = useState(false);

  // function closeModal() {
  //   setIsOpen(false);
  // }

  // useEffect(() => {
  //   const setOffline = async () => {
  //     !!data.chatId &&
  //       !!user_Logged_In &&
  //       (await updateDoc(doc(db, "usersChats", user_Logged_In.uid), {
  //         [data.chatId + ".unread_Messages"]: 0,
  //       }));
  //   };

  //   return () => {
  //     setOffline();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data.chatId]);

  return (
    <section className={styles.chat}>
      <header>
        <span>
          {window.screen.width <= 1300 && (
            <HiArrowSmLeft
              onClick={() => setShowModal(false)}
              style={{ fontSize: "2rem", color: "#fff", marginLeft: ".5rem" }}
            />
          )}
          {!!data.user.photoURL && (
            <img
              src={data.user.photoURL}
              alt={data.user.displayName + " profile picture."}
            />
          )}

          {!data.user.photoURL && data.chatId !== "null" && (
            <FaUserCircle className={styles.noUser} />
          )}

          <h3>
            {!!data && data?.user?.uid === user_Logged_In.uid
              ? "Me"
              : data?.user?.displayName}
          </h3>
        </span>
      </header>
      <Messages />
      <Input />
    </section>
  );
};
