/* eslint-disable @next/next/no-img-element */
import styles from "../styles/loadingPage.module.scss";

export default function LoadingPage() {
  return (
    <section className={styles.loadingPage}>
      <div>
        <h1 className={styles['focus-in-contract-bck']}>TR CHAT</h1>
        <h3 className={styles['focus-in-contract-bck']}>Powered by Thiago Reis</h3>
        <audio src="/audios/start2.mp3" autoPlay></audio>
        {/* <img src="/images/loading_dots.gif" alt="Loading dots." /> */}
      </div>
    </section>
  );
}
