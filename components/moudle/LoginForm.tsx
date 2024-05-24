'use client';
import { useState } from "react";
import { z } from "zod";
import LoginApi from "@/api/auth";
import { RequestLogin } from "@/types/requestType";
import { setCookie } from "cookies-next";

const LoginFormSchema = z.object({
    email: z.string()
        .email({ message: 'Invalid email address' })
        .refine(value => value.length > 0, { message: 'Email is required' }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .refine(value => value.length >= 8, { message: "Password must be at least 8 characters long" }),
});

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [errorMessages, setErrorMessages] = useState("");

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const { success, data, error } = LoginFormSchema.safeParse({
            email,
            password,
        });

        if (success) {
            // clear error messages
            setErrorMessages("");
            // clear errors
            setErrors({ email: '', password: '' });
            const requestLogin: RequestLogin = {
                email: data.email,
                password: data.password,
            }
            const login = async () => {
                const response = await LoginApi(requestLogin);
                if (response.isSuccess) {
                    // save token to cookie
                    if (!response.data?.bearerToken) {
                        setErrorMessages("Something went wrong !!!")
                    } else {
                        setCookie("token", response.data.bearerToken, {
                            maxAge: 60 * 60 * 24 * 7
                        });
                        // redirect to home page
                        window.location.href = "/";
                    }
                } else {
                    setErrorMessages(response.message ?? "Something went wrong !!!");
                }
            };
            login();
        } else {
            setErrors({
                email: error?.formErrors.fieldErrors.email ? error.formErrors.fieldErrors.email[0] : '',
                password: error?.formErrors.fieldErrors.password ? error.formErrors.fieldErrors.password[0] : '',
            });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-lg flex flex-col space-y-5 pt-7 pb-7">
            <div className="flex flex-col space-y-2">
                <label htmlFor="email">Email</label>
                <input className="p-1.5 pl-3 pr-3 w-full border rounded-sm" type="text" id="email" name="email" placeholder="example@example.com" onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            <div className="flex flex-col space-y-2">
                <label htmlFor="password">Password</label>
                <input className="p-1.5 pl-3 pr-3 w-full border rounded-sm" type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} />
                {errors.password && <p className="text-red-500">{errors.password}</p>}
            </div>
            <button type="submit" className="p-2 border hover:bg-orange-500 hover:text-white rounded-md font-medium">Sign in</button>
            {errorMessages && <p className="text-red-500">{errorMessages}</p>}
        </form>
    );
}