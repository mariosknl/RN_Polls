import { useAuth } from "@/src/providers/AuthProvider";
import { Redirect, Slot } from "expo-router";

export default function AuthLayout() {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return <Redirect href="/profile" />;
	}
	return <Slot />;
}
