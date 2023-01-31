/* eslint-disable @next/next/no-img-element */
import styles from "./styles.module.scss";
import { ChangeEvent, useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { v4 as uuid } from "uuid";
import { db, storage } from "../../config/firebaseClient";
import { doc, increment, serverTimestamp, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
import { firebaseServices } from "../../services/firebase";

const useSendMessagesAndMediaToFirebaseCollections = () => {
  const [text, setText] = useState<string>(""),
    [img, setImg] = useState<File | null>(null),
    { user } = useAuth(),
    { data } = useChat();

  const handleSend = useCallback(async (): Promise<void> => {
    setText("");
    setImg(null);
    if (!!data && img) {
      const storageRef: StorageReference = ref(storage, uuid());
      const uploadTask: UploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        () => {
          null;
        },
        () => {
          null;
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            firebaseServices.sendMessage(
              data.chatId,
              user.uid,
              text,
              downloadURL
            );
          });
        }
      );
    } else if (!!data && text !== "") {
      firebaseServices.sendMessage(data.chatId, user.uid, text);
    }

    if (text !== "" || img) {
      await updateDoc(doc(db, "usersChats", user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "usersChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
        [data.chatId + ".unread_Messages"]: increment(1),
      });
    }
  }, [data, img, text, user.uid]);

  return {
    data,
    setText,
    text,
    setImg,
    handleSend,
  };
};

export const Input = () => {
  const { data, setText, text, setImg, handleSend } =
    useSendMessagesAndMediaToFirebaseCollections();

  return (
    <>
      {data?.chatId !== "null" ? (
        <div className={styles.container}>
          <div className={styles.inputDIV}>
            <input
              type="text"
              placeholder="Type here your message..."
              onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                setText(e.target.value)
              }
              onKeyDown={async (event: any) => {
                event.code === "Enter" && handleSend();
              }}
              value={text}
            />
            <div>
              <img src={"/images/attach.png"} alt="" />
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e: any) => setImg(e.target.files[0])}
              />
              <label htmlFor="file">
                <img
                  src={"/images/img.png"}
                  alt="Click here to send your image."
                />
              </label>
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.noInput}></div>
      )}
    </>
  );
};
