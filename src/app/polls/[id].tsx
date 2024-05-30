import { useAuth } from "@/src/providers/AuthProvider";
import { supabase } from "@/src/lib/supabase";
import { Poll, Vote } from "@/src/types/db";
import { Feather } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Button,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";

export default function PollDetails() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [poll, setPoll] = useState<Poll>();
	const [userVote, setUserVote] = useState<Vote | null>(null);

	const [selected, setSelected] = useState("");
	const { user } = useAuth();

	useEffect(() => {
		const fetchPolls = async () => {
			let { data, error } = await supabase
				.from("polls")
				.select("*")
				.eq("id", Number.parseInt(id!))
				.single();
			if (error) {
				Alert.alert("Error fetching data...", error.message);
			}

			if (!data) return;
			setPoll(data);
		};

		// fetch user vote
		const fetchUserVote = async () => {
			if (!user) return;

			let { data, error } = await supabase
				.from("votes")
				.select("*")
				.eq("poll_id", Number.parseInt(id!))
				.eq("user_id", user?.id)
				.limit(1)
				.single();

			setUserVote(data);
			if (data) {
				setSelected(data.option);
			}
		};

		fetchPolls();
		fetchUserVote();
	}, []);

	const vote = async () => {
		const newVote = {
			option: selected,
			poll_id: poll?.id,
			user_id: user?.id,
		};

		if (userVote) {
			newVote.id = userVote.id;
		}

		const { data, error } = await supabase
			.from("votes")
			.upsert([newVote])
			.select()
			.single();

		if (error) {
			Alert.alert("Failed voting", error.message);
		} else {
			setUserVote(data);
			Alert.alert("Thank you for you vote");
		}
	};

	if (!poll) {
		return <ActivityIndicator />;
	}

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ title: "Poll voting" }} />
			<Text style={styles.question}>{poll.question}</Text>

			<View style={{ gap: 5 }}>
				{poll.options.map((option) => (
					<Pressable
						onPress={() => setSelected(option)}
						key={option}
						style={styles.optionContainer}
					>
						<Feather
							name={option === selected ? "check-circle" : "circle"}
							size={18}
							color={option === selected ? "green" : "gray"}
						/>
						<Text>{option}</Text>
					</Pressable>
				))}
			</View>

			<Button onPress={vote} title="Vote" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		gap: 20,
	},
	question: {
		fontSize: 20,
		fontWeight: "600",
	},
	optionContainer: {
		backgroundColor: "#fff",
		padding: 10,
		borderRadius: 5,
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	option: {},
});
