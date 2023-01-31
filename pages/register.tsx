/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import styles from "../styles/registerAndLogin.module.scss";
import router from "next/router";
import { useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { db, storage } from "../config/firebaseClient";
import { updateProfile, UserCredential } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useRegisterFormValidate } from "../hooks/useFormValidate";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

type FirebaseAuthErrors_Props = {
  passwordFirebaseAuthError?: string;
  emailFirebaseAuthError?: string;
};

const useHandleFirebaseUserRegister = () => {
  const [err, setErr] = useState<boolean>(false),
    [authErrors, setAuthErrors] = useState<FirebaseAuthErrors_Props>(),
    { register: registerUser } = useAuth(),
    [userImage, setUserImage] = useState<File | null>(null),
    [userImagePreview, setUserImagePreview] = useState<string | null>(null),
    { displayRegisterError, handleSubmit, register } =
      useRegisterFormValidate();

  const fileInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (!!userImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserImagePreview(reader.result as string);
      };
      reader.readAsDataURL(userImage);
    } else {
      setUserImagePreview(null);
    }
  }, [userImage]);

  const handleRegister = async ({
    displayName,
    email,
    password,
  }: FieldValues): Promise<void> => {
    registerUser(email, password)
      .then((response: UserCredential) => {
        if (!!userImage) {
          const storageRef = ref(storage, `users_images/${email}`);

          const uploadTask = uploadBytesResumable(storageRef, userImage);

          uploadTask.on(
            "state_changed",
            () => {
              null;
            },
            () => {
              setErr(true);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  await updateProfile(response.user, {
                    displayName,
                    photoURL: downloadURL,
                  });

                  await setDoc(doc(db, "users", response.user.uid), {
                    uid: response.user.uid,
                    displayName,
                    email,
                    photoURL: downloadURL,
                  });

                  await setDoc(doc(db, "usersChats", response.user.uid), {});
                }
              );
            }
          );
        } else {
          const registerWithNoPhoto = async () => {
            await updateProfile(response.user, {
              displayName,
              photoURL: null,
            });
            await setDoc(doc(db, "users", response.user.uid), {
              uid: response.user.uid,
              displayName,
              email,
              photoURL: null,
            });

            await setDoc(doc(db, "usersChats", response.user.uid), {});
          };
          registerWithNoPhoto();
        }

        setErr(false);
        if (!err) {
          router.push("/loadingPage");
          setTimeout(() => {
            router.push("/");
          }, 4000);
        }
      })
      .catch(({ code }) => {
        code === "auth/invalid-email" &&
          setAuthErrors({ emailFirebaseAuthError: "Invalid email!" });
        code === "auth/email-already-in-use" &&
          setAuthErrors({ emailFirebaseAuthError: "Email already in use!" });
      });
  };

  return {
    handleRegister,
    handleSubmit,
    register,
    displayRegisterError,
    authErrors,
    fileInputRef,
    setUserImage,
    userImagePreview,
  };
};

export default function Register() {
  const {
    handleRegister,
    handleSubmit,
    register,
    displayRegisterError,
    authErrors,
    fileInputRef,
    setUserImage,
    userImagePreview,
  } = useHandleFirebaseUserRegister();

  return (
    <section className={styles.containerSection}>
      <div className="blurEffect">
        <main className={styles.gifForm}>
          <div className={styles.imageVortex}></div>
          <div className={styles.formContainer}>
            <span>TR Chat</span>
            <span>Register</span>
            <form onSubmit={handleSubmit(handleRegister)}>
              <input
                style={{ display: "none" }}
                type="file"
                id="image"
                {...register("image")}
                className={styles.input}
                ref={fileInputRef}
                accept="image/png, image/jpg, image/jpeg"
                onChange={(e) => {
                  const file = !!e.target.files && e.target.files[0];
                  !!file && file.type.substring(0, 5) === "image"
                    ? setUserImage(file)
                    : setUserImage(null);
                }}
              />
              <label
                htmlFor="image"
                onClick={(event) => {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }}
                className={styles.userImage}
              >
                {!!userImagePreview ? (
                  <span className={styles.hover}>
                    <Image
                      src={userImagePreview}
                      alt="Click here to add your photo profile."
                      width={150}
                      height={150}
                      priority
                    />
                  </span>
                ) : (
                  <span className={styles.hoverUser}>
                    <FaUserCircle className={styles.userGeneric} />
                  </span>
                )}
              </label>
              <input
                type="text"
                placeholder="display name"
                id="displayName"
                {...register("displayName")}
                className={
                  displayRegisterError("displayName")
                    ? styles.inputError
                    : styles.input
                }
              />
              {displayRegisterError("displayName")}
              <input
                type="email"
                placeholder="email"
                {...register("email")}
                className={
                  displayRegisterError("email")!! ||
                  authErrors?.emailFirebaseAuthError
                    ? styles.inputError
                    : styles.input
                }
              />
              {displayRegisterError("email")
                ? displayRegisterError("email")
                : authErrors?.emailFirebaseAuthError && (
                    <small>{authErrors?.emailFirebaseAuthError}</small>
                  )}
              <input
                type="password"
                placeholder="password"
                {...register("password")}
                className={
                  displayRegisterError("password")
                    ? styles.inputError
                    : styles.input
                }
              />
              {displayRegisterError("password") &&
                displayRegisterError("password")}
              <input
                type="password"
                id="confirmPassword"
                placeholder="confirm your password"
                {...register("confirmPassword")}
                className={
                  displayRegisterError("confirmPassword")
                    ? styles.inputError
                    : styles.input
                }
              />
              {displayRegisterError("confirmPassword") &&
                displayRegisterError("confirmPassword")}
              <button>Sign up</button>
            </form>
            <small>Do you have an account yet? Login</small>
          </div>
        </main>
      </div>
    </section>
  );
}
