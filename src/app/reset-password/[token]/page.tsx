"use client";
import {
  useResetPasswordMutation,
} from "@/app/store/api";


interface RestPasswordFromData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

import { useParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { motion } from "framer-motion";
import { CheckCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
//import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Page: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  //  const router = useRouter();

  const [restPassword] = useResetPasswordMutation();
  const [resetPasswordSuccess, setRestPasswordSuccess] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestPasswordFromData>();

  const onSubmit = async (data: RestPasswordFromData) => {
    setResetPasswordLoading(true);
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Password not metech");
      return;
    }

    try {
      const result = await restPassword({
        token: token,
        newPassword: data.newPassword,
      }).unwrap();

      if (result.success) {
        toast.success("Password reset successfully ");
        setRestPasswordSuccess(true);
      }
    } catch (error) {
      console.log("Faild to reset password", error);
      toast.error("Faild to reset password ");
    } finally {
      setResetPasswordLoading(false);
    }
  };

  return (
    <div className="p-20 flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg text-center max-w-full"
      >

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Reset your Pssword
        </h2>

        {!resetPasswordSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                {...register("newPassword", {
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
            {errors.newPassword && (
              <p className="text-red-700 text-sm">
                {errors.newPassword.message}
              </p>
            )}
            <div className="relative">
              <Input
                {...register("confirmPassword", {
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
            {errors.confirmPassword && (
              <p className="text-red-700 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
            <Button
              type="submit"
              className="w-full font-bold bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              {resetPasswordLoading ? (
                <>
                  {" "}
                  <Loader2 className="animate-spin mr-2" size={20} />{" "}
                </>
              ) : (
                <>Reset Password</>
              )}
            </Button>
          </form>
        ) : (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }} >
            <CheckCircle className=' h-6 w-16 text-green-500 mx-auto mb-4' />
            <h2 className='text-2xl font-semibold text-gray-800 mb-2'> Reset Password Successfully </h2>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Page;
