"use client";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UserSchema, { UserSchemaType } from "@/utils/schemas/loginSchema";
import { useMutation } from "@tanstack/react-query";
import { loginAPI } from "@/api/auth";
import FormInput from "@/components/Form/Input";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  let router = useRouter();
  const methods = useForm<UserSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(UserSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = methods;

  const loginMutation = useMutation({
    mutationKey: ["/auth"],
    mutationFn: loginAPI,
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await loginMutation.mutateAsync(data, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          // Redirect depending on user role

        },
      });
    } catch (error) {
      reset();
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white p-5 rounded-lg shadow-lg flex flex-col space-y-5 pt-7 pb-7'
      >
        <div className='flex flex-col space-y-2'>
          <FormInput
            name='email'
            placeholder='Enter email'
            autofocus={true}
            key='email'
            label='Email'
          />
          {errors.email && (
            <p className='text-red-500'>{errors.email.message}</p>
          )}
        </div>
        <div className='flex flex-col space-y-2'>
          <FormInput
            name='password'
            placeholder='Enter password'
            key='password'
            type='password'
            label='Password'
          />
        </div>
        <button
          type='submit'
          className='p-2 border hover:bg-orange-500 hover:text-white rounded-md font-medium'
        >
          Sign in
        </button>
      </form>
    </FormProvider>
  );
}
