import { NextComment } from "@fuma-comment/server/next";
import { commentAuth } from "../../../../../auth";
import { storage } from "@features/shared/lib/storage";

export const { GET, DELETE, PATCH, POST } = NextComment({
	mention: { enabled: true },
	auth: commentAuth,
	storage: storage
});