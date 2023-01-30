/* eslint-disable @next/next/no-img-element */
import { User } from "firebase/auth";
import { useChat } from "../../../context/ChatContext";
import styles from "./styles.module.scss";
import { TiUserAdd } from "react-icons/ti";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { RiChatSmile2Fill } from "react-icons/ri";
import { useAuth } from "../../../context/AuthContext";

export const Users = ({
  chat,
  handleSelect,
  imageSRC,
  addUser,
  displayNameSearch,
  user,
  addedUsers,
}: {
  chat?: [string, any];
  handleSelect?: (user: User) => void;
  imageSRC?: string | null;
  addUser?: (user: any) => Promise<void>;
  displayNameSearch?: string;
  user?: User;
  addedUsers?: boolean;
}) => {
  const { data } = useChat();
  const { user: userLoggedIn } = useAuth();
  return (
    <div className={styles.containerAll}>
      {chat &&
        data.chatId !== chat[0] &&
        chat[1]["unread_Messages"] !== 0 &&
        chat[1]["unread_Messages"] && (
          <div className={styles.unread_Messages}>
            <small>
              {chat[1]["unread_Messages"] && chat[1]["unread_Messages"]}
            </small>
          </div>
        )}
      <div
        key={!!chat ? chat[0] : "userKey"}
        onClick={() => {
          !!handleSelect && chat
            ? handleSelect(chat[1].userInfo)
            : !!addUser && addUser(user);
        }}
        className={styles.container}
      >
        <div className={styles.divImgMessage}>
          {((!!chat && !!chat[1]?.userInfo?.photoURL) || !!imageSRC) && (
            <img
              src={!!chat ? chat[1]?.userInfo?.photoURL : imageSRC}
              alt="User image."
            />
          )}
          {!!chat && !chat[1]?.userInfo?.photoURL && (
            <FaUserCircle style={{ fontSize: "3.125rem" }} />
          )}
          {!chat && !imageSRC && (
            <FaUserCircle style={{ fontSize: "3.125rem" }} />
          )}
          <div className={styles.centerDiv}>
            <span
              style={!chat && !!addedUsers ? { color: "#3e9dc0" } : undefined}
            >
              {!!chat && chat[1]?.userInfo?.uid !== userLoggedIn.uid
                ? chat[1]?.userInfo?.displayName
                : displayNameSearch}
              {!!chat && chat[1]?.userInfo?.uid === userLoggedIn.uid && "Me"}
            </span>
            <small>{!!chat ? chat[1]?.lastMessage?.text : null}</small>
          </div>
        </div>
        {(!!chat || (!chat && !addedUsers)) && (
          <div>
            <div>
              {!!chat && <RiChatSmile2Fill />}
              {!chat && !addedUsers && <TiUserAdd />}
            </div>
          </div>
        )}
        {!chat && !!addedUsers && (
          <div>
            <div style={{ backgroundColor: "#3e9dc0" }}>
              {<HiOutlineBadgeCheck />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
