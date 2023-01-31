import styles from "../styles/home.module.scss";
import { Sidebar } from "../components/Sidebar";
import { Chat } from "../components/Chat";
import { Search } from "../components/Search";
import { Chats } from "../components/Chats";
import "bootstrap/dist/css/bootstrap.css";
import Carousel from "react-bootstrap/Carousel";
import { useEffect, useState } from "react";
// import { useEffect, useState } from "react";
// import { updateDoc, doc } from "firebase/firestore";
// import { db } from "../config/firebaseClient";
// import { useChat } from "../context/ChatContext";

// const useChangeOnlineStatus = () => {
//   const [isOnline, setIsOnline] = useState(true);
//   const userUID = localStorage.getItem("userUID")?.toString();

//   window.onbeforeunload = () => {
//     setIsOnline(false);
//     !!userUID && updateDoc(doc(db, "users", userUID), { isOnline: false });

//     return "Sair?";
//   };

//   useEffect(() => {
//     if (isOnline) return;

//     setIsOnline(true);
//     window.onmousemove = () => {
//       const userUID = localStorage.getItem("userUID")?.toString();
//       !!userUID &&
//         updateDoc(doc(db, "users", userUID), {
//           isOnline: true,
//         });
//     };
//   }, [isOnline]);
// };

export default function Home() {
  const [screenWidth, setScreenWidth] = useState(window.screen.width);
  const [biggerThan1300px, setBiggerThan1300px] = useState(true);

  useEffect(() => {
    setScreenWidth(window.screen.width);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.screen.width]);

  useEffect(() => {
    setBiggerThan1300px(screenWidth > 1300);
  }, [screenWidth]);

  //useChangeOnlineStatus();

  // const router = useRouter();
  // const unsavedChanges = true;
  // const warningText =
  //   "You have unsaved changes - are you sure you wish to leave this page?";

  // useEffect(() => {
  //   const handleWindowClose = (e: any) => {
  //     if (!unsavedChanges) return;
  //     e.preventDefault();
  //     return (e.returnValue = warningText);
  //   };

  //   const handleBrowseAway = () => {
  //     if (!unsavedChanges) return;
  //     if (!!window.confirm(warningText)) return;
  //     router.events.emit("routeChangeError");
  //     throw "routeChange aborted.";
  //   };

  //   window.addEventListener("beforeunload", handleWindowClose);
  //   router.events.on("routeChangeStart", handleBrowseAway);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleWindowClose);
  //     router.events.off("routeChangeStart", handleBrowseAway);
  //   };
  // }, [router.events, unsavedChanges]);

  return (
    <section className={styles.home}>
      <div className="blurEffect">
        <main className={styles.container}>
          {biggerThan1300px ? (
            <>
              <Sidebar>
                <Chats />
              </Sidebar>
              <Chat />
              <Sidebar>
                <Search />
              </Sidebar>
            </>
          ) : (
            <Carousel
              wrap={false}
              interval={null}
              touch={true}
              controls={false}
            >
              <Carousel.Item>
                <Sidebar>
                  <Chats />
                </Sidebar>
              </Carousel.Item>
              <Carousel.Item>
                <Sidebar>
                  <Search />
                </Sidebar>
              </Carousel.Item>
            </Carousel>
          )}
        </main>
      </div>
    </section>
  );
}
