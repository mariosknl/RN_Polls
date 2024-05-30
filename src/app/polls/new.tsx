import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/src/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { Redirect, Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function CreatePoll() {
	const [question, setQuestion] = useState<string>("");
	const [options, setOptions] = useState<string[]>(["", ""]);
	const [error, setError] = useState("");
	const router = useRouter();

	const { user } = useAuth();

	const createPoll = async () => {
		setError("");
		if (!question) {
			setError("Please enter a question");
			return;
		}
		const validOptions = options.filter((option) => !!option);
		if (validOptions.length < 2) {
			setError("Please enter at least 2 options");
			return;
		}

		// create poll
		const { data, error } = await supabase
			.from("polls")
			.insert([{ question, options: validOptions }])
			.select();

		if (error) {
			Alert.alert("Failed creating the poll");
			return;
		}

		router.back();
	};

	if (!user) {
		return <Redirect href="/login" />;
	}

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ title: "Create Poll" }} />

			<Text style={styles.label}>Title</Text>
			<TextInput
				value={question}
				onChangeText={setQuestion}
				placeholder="Type your question here"
				style={styles.input}
			/>

			<Text style={styles.label}>Options</Text>
			{options.map((option, index) => (
				<View key={index} style={{ justifyContent: "center" }}>
					<TextInput
						placeholder={`Option ${index + 1}`}
						value={option}
						onChangeText={(text) => {
							const updated = [...options];
							updated[index] = text;
							setOptions(updated);
						}}
						style={styles.input}
					/>
					<Feather
						name="x"
						size={18}
						color="gray"
						onPress={() => {
							// delete option based on index
							const updated = [...options];
							updated.splice(index, 1);
							setOptions(updated);
						}}
						style={{ position: "absolute", right: 10 }}
					/>
				</View>
			))}
			<Button title="Add option" onPress={() => setOptions([...options, ""])} />

			<Button title="Create Poll" onPress={createPoll} />
			<Text style={{ color: "crimson" }}>{error}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		gap: 5,
	},
	label: {
		marginTop: 10,
		fontWeight: "500",
	},
	input: {
		backgroundColor: "#fff",
		padding: 10,
		borderRadius: 5,
	},
});
