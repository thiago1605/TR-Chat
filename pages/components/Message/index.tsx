/* eslint-disable @next/next/no-img-element */
import { Timestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";
import styles from "./styles.module.scss";

type message_PROPS = {
  date: Timestamp;
  id: string;
  img?: string | null;
  senderId: string;
  text: string;
};

const useFetchMessagesAndMediaFromFirebase = (message: message_PROPS) => {
  const { user } = useAuth();
  const { data } = useChat();
  const [firebaseDate, setFirebaseDate] = useState<Date | null>(null);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    setFirebaseDate(new Date(message?.date?.seconds * 1000));
  }, [message, message?.date, message?.date?.seconds]);

  return {
    ref,
    user,
    data,
    firebaseDate,
  };
};

export const Message = ({ message }: { message: message_PROPS }) => {
  const { ref, user, data, firebaseDate } =
    useFetchMessagesAndMediaFromFirebase(message);

  return (
    <div
      ref={ref}
      className={`${styles.message} ${
        message?.senderId === user?.uid && styles.owner
      }`}
    >
      <div className={styles.firstDiv}>
        {!!data?.user?.photoURL &&
          message?.senderId !== user?.uid &&
          window.screen.width > 1300 && (
            <img
              src={data.user.photoURL.toString()}
              alt={data.user.displayName + " picture."}
            />
          )}

        {!!user?.photoURL &&
          message?.senderId === user?.uid &&
          window.screen.width > 1300 && (
            <img src={user?.photoURL?.toString()} alt={"Profile picture."} />
          )}

        {!user?.photoURL &&
          message?.senderId === user?.uid &&
          window.screen.width > 1300 && (
            <FaUserCircle style={{ fontSize: "2.5rem" }} />
          )}

        {!data?.user?.photoURL &&
          message?.senderId !== user?.uid &&
          window.screen.width > 1300 && (
            <FaUserCircle style={{ fontSize: "2.5rem" }} />
          )}

        {window.screen.width > 1300 && (
          <>
            <time>
              {firebaseDate &&
                firebaseDate.toLocaleTimeString()[0] +
                  firebaseDate.toLocaleTimeString()[1] +
                  firebaseDate.toLocaleTimeString()[2] +
                  firebaseDate.toLocaleTimeString()[3] +
                  firebaseDate.toLocaleTimeString()[4]}
            </time>
            <time>{firebaseDate?.toLocaleDateString()}</time>
          </>
        )}
      </div>
      <div className={styles.messageIMG_Container}>
        <div className={styles.messageIMG}>
          {message?.text !== "" ? <p>{message?.text}</p> : null}
          {message?.img && <img src={message?.img} alt="Image." />}
        </div>
        {window.screen.width <= 1300 && (
          <div className={styles.time}>
            <time>
              {firebaseDate &&
                firebaseDate.toLocaleTimeString()[0] +
                  firebaseDate.toLocaleTimeString()[1] +
                  firebaseDate.toLocaleTimeString()[2] +
                  firebaseDate.toLocaleTimeString()[3] +
                  firebaseDate.toLocaleTimeString()[4]}
            </time>
            <br />
            <time>{firebaseDate?.toLocaleDateString()}</time>
          </div>
        )}
      </div>
    </div>
  );
};
