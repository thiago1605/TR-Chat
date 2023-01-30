import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { IoIosChatbubbles } from "react-icons/io";
import { useChat } from "../../../context/ChatContext";
import { db } from "../../../config/firebaseClient";
import { Message } from "../Message";
import styles from "./styles.module.scss";

type messages_PROPS = [
  {
    date: Timestamp;
    id: string;
    img?: string | undefined;
    senderId: string;
    text: string;
  }
];

const useFetchMessagesFromFirebaseChatsCollection = () => {
  const { data } = useChat();
  const [messages, setMessages] = useState<messages_PROPS | null>(null);

  useEffect(() => {
    if (data) {
      const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });

      return () => {
        unSub();
      };
    }
  }, [data, data.chatId]);
  return {
    messages,
    data,
  };
};

export const Messages = () => {
  const { messages, data } = useFetchMessagesFromFirebaseChatsCollection();

  return data.chatId !== "null" ? (
    <div className={styles.messages}>
      {messages?.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  ) : (
    <div className={`${styles.messages} ${styles.trChat}`}>
      <div>
        <h1>TR CHAT</h1>
        <div>
          <IoIosChatbubbles />
        </div>
        <h2>
          Chat with someone <br /> right now!
        </h2>
      </div>
    </div>
  );
};
