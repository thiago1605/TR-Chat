import { User } from "firebase/auth";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useReducer,
  useState,
} from "react";
import { useAuth } from "../context/AuthContext";

type ChatContext_PROPS = {
  data: {
    chatId: string;
    user: {
      displayName: string;
      email: string;
      photoURL?: string;
      uid: string;
    };
  };
  dispatch: Dispatch<{
    type: "CHANGE_USER" | "CHANGE_USER_TO_NULL";
    payload?: User;
  }>;

  setIsPermitted: Dispatch<SetStateAction<boolean>>;
  isPermitted: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  showModal: boolean;
};

const ChatContext = createContext<any>(null);

export const useChat = () => useContext<ChatContext_PROPS>(ChatContext);

export const ChatContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();

  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state: object, action: any) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            user.uid > action.payload.uid
              ? user.uid + action.payload.uid
              : action.payload.uid + user.uid,
        };

      case "CHANGE_USER_TO_NULL":
        return INITIAL_STATE;

      default:
        return state;
    }
  };

  const [state, dispatch]: [
    state: object,
    dispatch: ChatContext_PROPS["dispatch"]
  ] = useReducer(chatReducer, INITIAL_STATE);

  const [isPermitted, setIsPermitted] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <ChatContext.Provider
      value={{
        data: state,
        dispatch,
        INITIAL_STATE,
        setIsPermitted,
        isPermitted,
        setShowModal,
        showModal,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
