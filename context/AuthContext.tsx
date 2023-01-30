import { createContext, useContext, useEffect, useState } from "react";
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  Unsubscribe,
  UserCredential,
} from "firebase/auth";
import { auth } from "../config/firebaseClient";

type userContext_PROPS = {
  user: {
    displayName: string | null;
    email: string | null;
    photoURL?: string | null;
    uid: string;
    isOnline?: boolean;
  };
  login(email: string, password: string): Promise<UserCredential>;
  logout: () => Promise<void>;
  register(email: string, password: string): Promise<UserCredential>;
};

const AuthContext = createContext<any>({});

export const useAuth = () => useContext<userContext_PROPS>(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<userContext_PROPS["user"] | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe: Unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async (): Promise<void> => {
    setUser(null);
    await signOut(auth);
  };

  const login = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    await setPersistence(auth, browserSessionPersistence);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    await setPersistence(auth, browserSessionPersistence);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
