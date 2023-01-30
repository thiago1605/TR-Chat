/* eslint-disable @next/next/no-img-element */
import router from "next/router";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";
import styles from "./styles.module.scss";

export const Navbar = () => {
  const { logout, user } = useAuth();
  const { setIsPermitted } = useChat();

  return (
    <header className={styles.navbar}>
      <span>
        <img src="/images/my-logo-white.png" alt="Thiago Reis Logo" />
        <div>
          <div
            onClick={async () => {
              await logout();
              setIsPermitted(false);
              router.push("/login");
              // await updateDoc(doc(db, "users", user.uid), { isOnline: false });
            }}
          >
            <small>Logout</small>
            {!!user.photoURL ? (
              <img src={user?.photoURL?.toString()} alt="user" />
            ) : (
              <div>
                <FaUserCircle />
              </div>
            )}
          </div>
          {/* <span>{user?.displayName}</span> */}
        </div>
      </span>
    </header>
  );
};
