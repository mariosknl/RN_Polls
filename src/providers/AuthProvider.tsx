import { supabase } from "@/src/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

type AuthContextType = {
	session: Session | null;
	user: User | undefined;
	isAuthenticated: boolean | undefined;
};

const AuthContext = createContext<AuthContextType>({
	session: null,
	user: undefined,
	isAuthenticated: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);

			if (!session) {
				supabase.auth.signInAnonymously();
			}
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	return (
		<AuthContext.Provider
			value={{
				session,
				user: session?.user,
				isAuthenticated: session?.user && !session?.user.is_anonymous,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
