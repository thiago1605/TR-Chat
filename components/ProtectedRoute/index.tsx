import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";

const useProtectRouteData = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [calledPush, setCalledPush] = useState(false);

  useEffect(() => {
    setCalledPush(false);

    !user && !calledPush && router.push("/login");
    setCalledPush(true);
  }, [calledPush, router, user]);

  const { isPermitted, setIsPermitted } = useChat();
  router.pathname === "/" && !!user && setIsPermitted(false);

  useEffect(() => {
    router.pathname === "/loadingPage" && !isPermitted && router.push("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPermitted]);

  return {
    user,
    router,
    isPermitted,
  };
};

export const AuthRequired = ({ children }: { children: React.ReactNode }) => {
  const { user, router, isPermitted } = useProtectRouteData();
  console.log(isPermitted);

  return (
    <>
      {router.pathname === "/" && !!user && children}
      {router.pathname === "/loadingPage" && !!isPermitted && children}
    </>
  );
};
