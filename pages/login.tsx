/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import styles from "../styles/registerAndLogin.module.scss";
import { NextRouter, useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { FieldValues } from "react-hook-form";
import { useChat } from "../context/ChatContext";
import { useLoginFormValidate } from "./hooks/useFormValidate";
import { FirebaseError } from "firebase/app";
import { UserCredential } from "firebase/auth";

type FirebaseAuthErrors_Props = {
  passwordFirebaseAuthError?: string;
  emailFirebaseAuthError?: string;
  tooManyRequestsFirebaseAuthError?: string;
};

const useHandleFirebaseLogin = () => {
  const { login } = useAuth(),
    [authError, setAuthError] = useState<FirebaseAuthErrors_Props>(),
    router: NextRouter = useRouter(),
    { handleSubmit, register, displayLoginError } = useLoginFormValidate();
    

  const { dispatch, setIsPermitted } = useChat();

  const handleLogin = async ({
    email,
    password,
  }: FieldValues): Promise<void> => {
    setAuthError(undefined);
    await login(email, password)
      .then(async (userLoggedIn: UserCredential) => {
        setIsPermitted(true);

        setAuthError(undefined);

        if (!!userLoggedIn.user) {
          localStorage.setItem("userUID", userLoggedIn.user.uid.toString());

          // await updateDoc(doc(db, "users", userLoggedIn.user.uid), {
          //   isOnline: true,
          // });

          router.push("/loadingPage");
          dispatch({ type: "CHANGE_USER_TO_NULL" });
          setTimeout(() => {
            router.push("/");
          }, 4000);
          
        }
      })
      .catch(({ code }: FirebaseError) => {
        code === "auth/wrong-password" &&
          setAuthError({ passwordFirebaseAuthError: "Invalid password!" });
        code === "auth/user-not-found" &&
          setAuthError({ emailFirebaseAuthError: "User not found!" });
        code === "auth/too-many-requests" &&
          setAuthError({
            tooManyRequestsFirebaseAuthError:
              "Too many attempts, try login again later!",
          });
      });
  };

  return {
    handleLogin,
    handleSubmit,
    register,
    displayLoginError,
    authError,
  };
};

export default function Login() {
  const { handleLogin, handleSubmit, register, displayLoginError, authError } =
    useHandleFirebaseLogin();

  return (
    <section className={styles.containerSection}>
      <div className="blurEffect">
        <main className={styles.gifForm}>
          <div className={styles.imageVortex}></div>
          <div className={`${styles.formContainer} ${styles.formLogin}`}>
            <span>TR Chat</span>
            <span>Login</span>
            <form onSubmit={handleSubmit(handleLogin)}>
              <input
                {...register("email")}
                type="email"
                placeholder="email"
                className={
                  displayLoginError("email") ||
                  authError?.emailFirebaseAuthError
                    ? styles.inputError
                    : styles.input
                }
              />
              {displayLoginError("email")
                ? displayLoginError("email")
                : authError?.emailFirebaseAuthError && (
                    <small>{authError?.emailFirebaseAuthError}</small>
                  )}
              <input
                {...register("password")}
                type="password"
                placeholder="password"
                className={
                  displayLoginError("password") ||
                  authError?.passwordFirebaseAuthError ||
                  authError?.tooManyRequestsFirebaseAuthError
                    ? styles.inputError
                    : styles.input
                }
              />
              {displayLoginError("password")
                ? displayLoginError("password")
                : (authError?.passwordFirebaseAuthError && (
                    <small>{authError?.passwordFirebaseAuthError}</small>
                  )) ||
                  (authError?.tooManyRequestsFirebaseAuthError && (
                    <small>{authError?.tooManyRequestsFirebaseAuthError}</small>
                  ))}
              <button>Sign in</button>
            </form>
            <small>Do you not have an account? Register</small>
          </div>
        </main>
      </div>
    </section>
  );
}
