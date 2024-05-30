import AuthProvider from "@/providers/AuthProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
	return (
		<AuthProvider>
			<Stack />
		</AuthProvider>
	);
}
