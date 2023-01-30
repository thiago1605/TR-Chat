import {
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseClient";
import { v4 as randomID } from "uuid";

const sendMessage = async (
  chatUID: string,
  userUID: string,
  text: string,
  img?: string
) => {
  if (!!img) {
    await updateDoc(doc(db, "chats", chatUID), {
      messages: arrayUnion({
        id: randomID(),
        text,
        senderId: userUID,
        date: Timestamp.now(),
        img,
      }),
    });
  } else {
    await updateDoc(doc(db, "chats", chatUID), {
      messages: arrayUnion({
        id: randomID(),
        text,
        senderId: userUID,
        date: Timestamp.now(),
      }),
    });
  }
};

export const firebaseServices = {
  sendMessage,
};
