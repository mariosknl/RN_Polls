import { supabase } from "@/src/lib/supabase";
import { Poll } from "@/src/types/db";
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

	const [selected, setSelected] = useState("");

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

		fetchPolls();
	}, []);

	const vote = () => {
		console.log("Vote:", selected);
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
