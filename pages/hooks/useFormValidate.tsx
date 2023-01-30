import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, ref, string, mixed } from "yup";

export const useRegisterFormValidate = () => {
  const registerSchema = object({
    displayName: string()
      .required("Enter your name!")
      .min(3, "Enter a name with 3 caracters at least!"),
    email: string()
      .required("Enter your email address!")
      .email("Enter a valid email!"),
    password: string()
      .required("Enter your password!")
      .min(6, "Enter a password with 6 caracters at least!"),
    confirmPassword: string().oneOf(
      [ref("password"), null],
      "Passwords must match"
    ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  }: FieldValues = useForm({ resolver: yupResolver(registerSchema) });

  const displayRegisterError = (
    typeError: "email" | "password" | "displayName" | "confirmPassword"
  ): JSX.Element | undefined => {
    if (errors?.email && typeError === "email") {
      return (
        <small className="error">
          {typeError === "email" && errors?.email?.message}
        </small>
      );
    } else if (errors?.password && typeError === "password") {
      return (
        <small className="error">
          {typeError === "password" && errors?.password?.message}
        </small>
      );
    } else if (errors?.displayName && typeError === "displayName") {
      return (
        <small className="error">
          {typeError === "displayName" && errors?.displayName?.message}
        </small>
      );
    } else if (errors?.confirmPassword && typeError === "confirmPassword") {
      return (
        <small className="error">
          {typeError === "confirmPassword" && errors?.confirmPassword?.message}
        </small>
      );
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    displayRegisterError,
  };
};

export const useLoginFormValidate = () => {
  const loginSchema = object({
    email: string()
      .required("Enter your email address!")
      .email("Enter a valid email!"),
    password: string()
      .required("Enter your password!")
      .min(6, "Enter a password with 6 caracters at least!"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  }: FieldValues = useForm({ resolver: yupResolver(loginSchema) });

  const displayLoginError = (typeError: "email" | "password") => {
    if (errors?.email && typeError === "email") {
      return (
        <small className="error">
          {typeError === "email" && errors?.email?.message}
        </small>
      );
    } else if (errors?.password && typeError === "password") {
      return (
        <small className="error">
          {typeError === "password" && errors?.password?.message}
        </small>
      );
    }
  };
  return {
    register,
    handleSubmit,
    displayLoginError,
  };
};
