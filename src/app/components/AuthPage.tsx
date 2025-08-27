"use clent";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useForgotPasswordMutation, useLoginMutation, useRegisterMutation } from "../store/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authStatus, toggleLoginDialog } from "../store/slice/userSlice";
interface LoginProps {
  isLoginOpen: boolean;
  setIsloginOpen: (open: boolean) => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface ForgotPasswordFormData {
  email: string;
}

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}
const AuthPage: React.FC<LoginProps> = ({ isLoginOpen, setIsloginOpen }) => {
  const [currentTab, setCurrentTab] = useState<"login" | "signup" | "forgot">(
    "login"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [forgetPasswordSuccess, setForgetPasswordSuccess] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const dispatch = useDispatch();

  const [register] = useRegisterMutation()
  const [login] = useLoginMutation()
  const [forgotPassword] = useForgotPasswordMutation()

  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signupError },
  } = useForm<SignUpFormData>();
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginError },
  } = useForm<LoginFormData>();
  const {
    register: registerForgotPassword,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordError },
  } = useForm<ForgotPasswordFormData>();


  const onSubmitSignUp = async (data: SignUpFormData) => {
    setSignupLoading(true);

    try {
      const { email, password, name } = data;
      const result = await register({ email, password, name }).unwrap();
      console.log("this is register result", result)
      if (result.success) {
        toast.success("Verification link send to your email successfully")
        dispatch(toggleLoginDialog())
      }
    } catch (error) {
      console.log("Error on register", error)
      toast.error("Email Allready Register");
    } finally {
      setSignupLoading(false);
    }
  }

  const onSubmitLogin = async (data: LoginFormData) => {
    setLoginLoading(true);

    try {
      const { email, password } = data;
      const result = await login({ email, password }).unwrap();
      console.log("this is login result", result)
      if (result.success) {
        toast.success("Login successfully")
        dispatch(toggleLoginDialog())
        dispatch(authStatus())
        window.location.reload();
      }
    } catch (error) {
      console.log("Error on login", error)
      toast.error("Email and password not metch ");
    } finally {
      setLoginLoading(false);
    }
  }

  const onSubmitFogotPassword = async (data: ForgotPasswordFormData) => {
    setForgetPasswordSuccess(true);

    try {
      const { email } = data;
      const result = await forgotPassword({ email }).unwrap();

      if (result.success) {
        toast.success("Mail send successfully for forgot password")
        dispatch(toggleLoginDialog())
      }
    } catch (error) {
      console.log("Error on forgot password", error)
      toast.error("Email not found ");
    } finally {
      setForgetPasswordSuccess(false);
    }
  }

  const handleGoogleLogin = async () => {

    console.log("this is google login", `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`)
    setGoogleLoading(true);
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
      //router?.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`);

      dispatch(authStatus());
      dispatch(toggleLoginDialog())
    } catch (error) {
      console.log("Error on Google login", error);
      toast.error("Google login failed");
    } finally {
      setGoogleLoading(false);
    }

    setTimeout(() => {
      setGoogleLoading(false);
      dispatch(toggleLoginDialog())
      toast.success("Google login is not implemented yet");
    }, 2000);
  };
  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsloginOpen}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogTitle className=" text-2xl text-center font-bold mb-4">
          Welcome to Bookcart
        </DialogTitle>
        <Tabs
          value={currentTab}
          onValueChange={(value) =>
            setCurrentTab(value as "login" | "signup" | "forgot")
          }
        >
          <TabsList className="grid grid-cols-3 w-full gap-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
            <TabsTrigger value="forgot">Forgot Password</TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLoginSubmit(onSubmitLogin)} className="space-y-4">
                  <div className="relative">
                    <Input
                      {...registerLogin("email", {
                        required: "Email is required",
                      })}
                      placeholder="Email"
                      type="email"
                      className="pl-10"
                    />
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 "
                      size={20}
                    />
                  </div>
                  {loginError.email && (
                    <p className="text-red-700 text-sm">
                      {loginError.email.message}
                    </p>
                  )}
                  <div className="relative">
                    <Input
                      {...registerLogin("password", {
                        required: "Password is required",
                      })}
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10"
                    />
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 "
                      size={20}
                    />
                    {showPassword ? (
                      <>
                        <EyeOff
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 "
                          size={20}
                          onClick={() => setShowPassword(false)}
                        />
                      </>
                    ) : (
                      <>
                        <Eye
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 "
                          size={20}
                          onClick={() => setShowPassword(true)}
                        />
                      </>
                    )}
                  </div>
                  {loginError.password && (
                    <p className="text-red-700 text-sm">
                      {loginError.password.message}
                    </p>
                  )}
                  <Button type="submit" className="w-full font-bold">
                    {loginLoading ? (
                      <>
                        {" "}
                        <Loader2 className="animate-spin mr-2" size={20} />{" "}
                      </>
                    ) : (
                      <>Login</>
                    )}
                  </Button>
                </form>

                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <p className="mx-2 text-gray-500 text-sm">Or</p>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <Button onClick={handleGoogleLogin} className="w-full flex items-center cursor-pointer justify-center gap-2 bg-white text-gray-700 border border-gray-400">
                  {googleLoading ? (
                    <>
                      {" "}
                      <Loader2 className="animate-spin mr-2" size={20} /> login
                      with Google...
                    </>
                  ) : (
                    <>
                      <Image
                        src="/icons/google.svg"
                        alt="login google"
                        width={20}
                        height={20}
                      />
                      Login with Google
                    </>
                  )}
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="space-y-4">
                <form className="space-y-4" onSubmit={handleSignUpSubmit(onSubmitSignUp)} >
                  <div className="relative">
                    <Input
                      {...registerSignUp("name", {
                        required: "Name is required",
                      })}
                      placeholder="Name"
                      type="text"
                      className="pl-10"
                    />
                    <User2
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 "
                      size={20}
                    />
                  </div>
                  {signupError.name && (
                    <p className="text-red-700 text-sm">
                      {signupError.name.message}
                    </p>
                  )}
                  <div className="relative">
                    <Input
                      {...registerSignUp("email", {
                        required: "Email is required",
                      })}
                      placeholder="Email"
                      type="email"
                      className="pl-10"
                    />
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 "
                      size={20}
                    />
                  </div>
                  {signupError.email && (
                    <p className="text-red-700 text-sm">
                      {signupError.email.message}
                    </p>
                  )}
                  <div className="relative">
                    <Input
                      {...registerSignUp("password", {
                        required: "Password is required",
                      })}
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10"
                    />
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 "
                      size={20}
                    />
                    {showPassword ? (
                      <>
                        <EyeOff
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 "
                          size={20}
                          onClick={() => setShowPassword(false)}
                        />
                      </>
                    ) : (
                      <>
                        <Eye
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 "
                          size={20}
                          onClick={() => setShowPassword(true)}
                        />
                      </>
                    )}
                  </div>
                  {signupError.password && (
                    <p className="text-red-700 text-sm">
                      {signupError.password.message}
                    </p>
                  )}

                  <div className="flex items-center ">
                    <Input
                      type="checkbox"
                      className="mr-2 h-5 w-5"
                      {...registerSignUp("agreeTerms", {
                        required: "Agree to Terms is required",
                      })}
                    />
                    <label className="text-sm text-gray-700">
                      Agree to Terms and Condition
                    </label>
                  </div>
                  {signupError.agreeTerms && (
                    <p className="text-red-700 text-sm">
                      {signupError.agreeTerms.message}
                    </p>
                  )}
                  <Button type="submit" className="w-full font-bold">
                    {signupLoading ? (
                      <>
                        {" "}
                        <Loader2 className="animate-spin mr-2" size={20} />{" "}
                      </>
                    ) : (
                      <>SignUp</>
                    )}
                  </Button>
                </form>

                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <p className="mx-2 text-gray-500 text-sm">Or</p>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <Button onClick={handleGoogleLogin} className="w-full flex items-center cursor-pointer justify-center gap-2 bg-white text-gray-700 border border-gray-400">
                  {googleLoading ? (
                    <>
                      {" "}
                      <Loader2 className="animate-spin mr-2" size={20} /> Signup
                      with Google...
                    </>
                  ) : (
                    <>
                      <Image
                        src="/icons/google.svg"
                        alt="login google"
                        width={20}
                        height={20}
                      />
                      Signup with Google
                    </>
                  )}
                </Button>
              </TabsContent>
              <TabsContent value="forgot" className="space-y-4">
                {!forgetPasswordSuccess ? (
                  <>
                    <form onSubmit={handleForgotPasswordSubmit(onSubmitFogotPassword)} className="space-y-4">
                      <div className="relative">
                        <Input
                          {...registerForgotPassword("email", {
                            required: "Email is required",
                          })}
                          placeholder="Email"
                          type="email"
                          className="pl-10"
                        />
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 "
                          size={20}
                        />
                      </div>
                      {forgotPasswordError.email && (
                        <p className="text-red-700 text-sm">
                          {forgotPasswordError.email.message}
                        </p>
                      )}
                      <Button type="submit" className="w-full font-bold">

                        <>Send rest Link</>

                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center space-y-3"
                    >
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                      <h3 className="text-xl font-semibold text-gray-600">
                        Rest link sended
                      </h3>
                      <p className="text-gray-500 ">
                        We have sent a password reset link to your email. Please
                        check your inbox and follow the instructions to reset
                        your password.
                      </p>
                      <Button
                        onClick={() => setForgetPasswordSuccess(false)}
                        className="w-full"
                      >
                        Send another llink to Email
                      </Button>
                    </motion.div>
                  </>
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
        <p className=" text-sm text-center text-gray-500">By click agree, you agree to Over {" "}<Link href='/turms-of-user' className="text-blue-500 hover:underline ">Terms of use</Link>{" "}<Link href='/privacy-policy' className="text-blue-500 hover:underline ">Privacy policy</Link> </p>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPage;
