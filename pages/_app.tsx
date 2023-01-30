import "../config/firebaseClient";
import "../styles/global.scss";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../context/AuthContext";
import { useRouter } from "next/router";
import { AuthRequired } from "./components/ProtectedRoute/AuthRequired";
import { ChatContextProvider } from "../context/ChatContext";

const noAuthRequired: string[] = ["/login", "/register"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AuthContextProvider>
      <ChatContextProvider>
        {noAuthRequired.includes(router.pathname) && (
          <Component {...pageProps} />
        )}
        {!noAuthRequired.includes(router.pathname) && (
          <AuthRequired>
            <Component {...pageProps} />
          </AuthRequired>
        )}
      </ChatContextProvider>
    </AuthContextProvider>
  );
}
