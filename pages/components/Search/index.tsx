/* eslint-disable @next/next/no-img-element */
import styles from "./styles.module.scss";
import { FaUserAltSlash } from "react-icons/fa";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  QuerySnapshot,
  DocumentData,
  serverTimestamp,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../config/firebaseClient";
import { useAuth } from "../../../context/AuthContext";
import { Users } from "../../components/Users";
import { Unsubscribe, User } from "firebase/auth";
import { MdPersonSearch } from "react-icons/md";
import { BiSearchAlt } from "react-icons/bi";

const useHandleSearchUserAndFetchDataUserFromFirebase = () => {
  const [nameFromInput, setNameFromInput] = useState<string>("");
  const [usersList, setUsersList] = useState<DocumentData[any]>([]);
  const [filteredUsers, setFilteredUsers] = useState<DocumentData[] | null>([]);
  const [chats, setChats] = useState<any>([]);
  const [addedUsers, setAddedUsers] = useState<string[]>([]);

  const [error, setError] = useState<boolean>(false);
  const { user } = useAuth();

  const fetchAllUsersFromFirebase = async () => {
    try {
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
        collection(db, "users")
      );

      const data: DocumentData[] = [];

      querySnapshot.forEach((userFound) => {
        data.push(userFound.data());
      });

      setUsersList(data);
    } catch (error) {
      setError(true);
    }
  };

  const getChats: () => Unsubscribe = useCallback(() => {
    let arrayChats: any = {};
    return onSnapshot(doc(db, "usersChats", user.uid), (doc) => {
      arrayChats = doc.data();
      !!arrayChats &&
        setChats(
          Object.entries(arrayChats).map(
            (e: any) => e[1] && e[1].userInfo && e[1].userInfo.uid
          )
        );
    });
  }, [user.uid]);

  useEffect(() => {
    user.uid && getChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid]);

  const handleSearch = (): void => {
    setFilteredUsers(() =>
      usersList.filter(
        (user: User) =>
          !!user.displayName &&
          nameFromInput !== "" &&
          user.displayName.toLowerCase().includes(nameFromInput.toLowerCase())
      )
    );
  };

  const handleKeyDown = async (): Promise<void> => {
    setFilteredUsers(null);
    await fetchAllUsersFromFirebase();
    handleSearch();
  };

  useEffect(() => {
    handleKeyDown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameFromInput]);

  useEffect(() => {
    !!filteredUsers &&
      !!chats &&
      setAddedUsers(
        filteredUsers.map((user: any) =>
          chats.filter((uid: string) => uid === user.uid)
        )
      );
  }, [chats, filteredUsers]);

  // console.log(chats);
  // console.log(filteredUsers);

  const handleSelect = async (userFromSearch: User): Promise<void> => {
    //check wheter the group(chats in firestore) exists or not, if not create it

    const COMBINED_ID =
      user.uid > userFromSearch?.uid
        ? user.uid + userFromSearch?.uid
        : userFromSearch?.uid + user.uid;

    try {
      const res = await getDoc(doc(db, "chats", COMBINED_ID));

      if (!res.exists()) {
        //create a chat in chat collection
        await setDoc(doc(db, "chats", COMBINED_ID), {
          messages: [],
        });

        //create user chats
        await updateDoc(doc(db, "usersChats", user.uid), {
          [COMBINED_ID + ".userInfo"]: {
            uid: userFromSearch?.uid,
            displayName: userFromSearch?.displayName,
            photoURL: userFromSearch?.photoURL,
          },
          [COMBINED_ID + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "usersChats", userFromSearch?.uid), {
          [COMBINED_ID + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [COMBINED_ID + ".date"]: serverTimestamp(),
        });
      }

      // dispatch({ type: "CHANGE_USER", payload: useR });
    } catch (error) {}
    setUsersList([]);
    setNameFromInput("");
  };

  return {
    handleKeyDown,
    handleSelect,
    setNameFromInput,
    nameFromInput,
    usersList,
    filteredUsers,
    addedUsers,
  };
};

export const Search = () => {
  const {
    handleSelect,
    setNameFromInput,
    nameFromInput,
    filteredUsers,
    addedUsers,
  } = useHandleSearchUserAndFetchDataUserFromFirebase();

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.input_container}>
          <BiSearchAlt style={{ fontSize: "1.6rem", marginRight: ".6rem" }} />
          <input
            type="text"
            placeholder="Find an user..."
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              e.target.value !== nameFromInput &&
              setNameFromInput(e.target.value)
            }
            value={nameFromInput}
          />
        </div>
      </header>
      <div className={styles.users_list_container}>
        <div className={styles.users_list}>
          {!!filteredUsers &&
            !!nameFromInput &&
            filteredUsers.map((user: any) => {
              let isTrue: boolean = false;
              addedUsers?.filter((e) =>
                e[0] === user.uid ? (isTrue = true) : null
              );

              return (
                <Users
                  key={user.uid}
                  imageSRC={user.photoURL}
                  addUser={handleSelect}
                  user={user}
                  displayNameSearch={user.displayName}
                  addedUsers={isTrue}
                />
              );
            })}
          {filteredUsers?.length === 0 && !!nameFromInput && (
            <>
              <span className={styles.user_not_found}>User not found... </span>
              <div className={styles.search_user_icon}>
                <FaUserAltSlash />
              </div>
            </>
          )}
          {filteredUsers?.length === 0 && !nameFromInput && (
            <div className={styles.search_user_icon}>
              <MdPersonSearch />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
