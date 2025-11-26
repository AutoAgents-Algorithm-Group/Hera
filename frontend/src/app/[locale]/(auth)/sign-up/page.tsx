"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signUp } from "@/lib/auth/client";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const router = useRouter();
	const pathname = usePathname();
	const [loading, setLoading] = useState(false);
	
	// Extract locale from path
	const locale = pathname?.split('/')[1] || 'en';

	return (
		<div className="flex min-h-screen flex-col p-6" style={{ backgroundColor: '#faf9f6' }}>
			{/* Logo and Brand - top left */}
			<div className="flex items-center gap-3 mb-8">
				<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
					H
				</div>
				<h1 className="text-xl font-semibold">Hera</h1>
			</div>

			{/* Centered sign up card */}
			<div className="flex flex-1 items-center justify-center">
				<div className="w-full max-w-md">
					<Card>
					<CardHeader>
						<CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
						<CardDescription className="text-xs md:text-sm">
							Enter your information to create an account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<div className="grid gap-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									placeholder="Your name"
									required
									onChange={(e) => {
										setName(e.target.value);
									}}
									value={name}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									onChange={(e) => {
										setEmail(e.target.value);
									}}
									value={email}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									autoComplete="new-password"
									placeholder="Password"
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password_confirmation">Confirm Password</Label>
								<Input
									id="password_confirmation"
									type="password"
									value={passwordConfirmation}
									onChange={(e) => setPasswordConfirmation(e.target.value)}
									autoComplete="new-password"
									placeholder="Confirm Password"
								/>
							</div>
							<Button
								type="submit"
								className="w-full"
								disabled={loading}
								onClick={async () => {
									if (password !== passwordConfirmation) {
										toast.error("Passwords do not match");
										return;
									}
									
									await signUp.email({
										email,
										password,
										name,
										callbackURL: `/${locale}`,
										fetchOptions: {
											onResponse: () => {
												setLoading(false);
											},
											onRequest: () => {
												setLoading(true);
											},
											onError: (ctx) => {
												toast.error(ctx.error.message);
											},
											onSuccess: async () => {
												toast.success("Account created successfully!");
												router.push(`/${locale}`);
											},
										},
									});
								}}
							>
								{loading ? (
									<Loader2 size={16} className="animate-spin" />
								) : (
									"Create an account"
								)}
							</Button>
						</div>
					</CardContent>
					<CardFooter>
						<div className="text-center text-sm w-full">
							Already have an account?{" "}
							<Link href={`/${locale}/sign-in`} className="underline">
								Sign in
							</Link>
						</div>
					</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}

