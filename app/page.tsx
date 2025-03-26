// SignInPage.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Mail, Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
// Define Zod schema for form validation
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

interface FieldRenderProps {
  field: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<HTMLInputElement>;
  };
}

const SignInPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Initialize React Hook Form
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const onSubmit = async (values: SignInFormValues) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl,
      });

      if (!res?.error) {
        router.push(callbackUrl);
        toast.success("Đăng nhập thành công");
        signInForm.reset();
      } else {
        toast.error("Tên đăng nhập hoặc mật khẩu sai");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra rồi");
    }
  };

  

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <Form {...signInForm}>
              <form onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-4">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }: FieldRenderProps) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Email address</FormLabel>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                            <Mail className="h-4 w-4" />
                          </div>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              className={cn(
                                "w-full h-10 pl-9 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600",
                                field.value && !signInForm.formState.errors.email
                                  ? "border-green-500 focus-visible:ring-green-500"
                                  : ""
                              )}
                              {...field}
                              disabled={loading}
                            />
                          </FormControl>
                          {field.value && !signInForm.formState.errors.email && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </div>
                          )}
                        </div>
                        <FormMessage className="text-xs flex items-center gap-1">
                          {signInForm.formState.errors.email && (
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                          )}
                          {signInForm.formState.errors.email?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }: FieldRenderProps) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Password</FormLabel>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                            <Lock className="h-4 w-4" />
                          </div>
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Your password"
                              className={cn(
                                "w-full h-10 pl-9 pr-16 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600",
                                field.value && !signInForm.formState.errors.password
                                  ? "border-green-500 focus-visible:ring-green-500"
                                  : ""
                              )}
                              {...field}
                              disabled={loading}
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 mr-1" />
                            ) : (
                              <Eye className="h-4 w-4 mr-1" />
                            )}
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                        <FormMessage className="text-xs flex items-center gap-1">
                          {signInForm.formState.errors.password && (
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                          )}
                          {signInForm.formState.errors.password?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 transition-colors h-11 rounded-lg font-medium text-white"
                    disabled={loading || !signInForm.formState.isValid}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignInPage;