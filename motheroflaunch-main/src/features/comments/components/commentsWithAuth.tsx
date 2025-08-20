"use client";
import { Comments } from "@fuma-comment/react";
import { createAuthClient } from "better-auth/client";
import "@fuma-comment/react/style.css";

const authClient = createAuthClient();

const signIn = () => {
	void authClient.signIn.social({
		provider: "github", // or "google", etc.
	});
};

export function CommentsWithAuth({ page }: { page: string }) {
	return (
		<>
		
		<Comments
			
			page={page}
			className="max-w-[800px] w-full"
			auth={{
				type: "api",
				signIn,
			}}
		/>
		
		</>
		
	);
}
