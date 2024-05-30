import { Feather } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

const poll = {
	question: "React Native vs Flutter",
	options: ["React Native FTW", "Flutter", "SwiftUI"],
};

export default function PollDetails() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [selected, setSelected] = useState("Flutter");

	const vote = () => {
		console.log("Vote:", selected);
	};

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
