import { AntDesign } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function HomeScreen() {
	const [polls, setPolls] = useState<
		| { created_at: string; id: number; options: string[]; question: string }[]
		| []
	>([]);

	useEffect(() => {
		const fetchPolls = async () => {
			let { data, error } = await supabase.from("polls").select("*");
			if (error) {
				Alert.alert("Error fetching data...", error.message);
			}

			if (!data) return;
			setPolls(data);
		};

		fetchPolls();
	}, []);

	return (
		<>
			<Stack.Screen
				options={{
					title: "Polls",
					headerRight: () => (
						<Link href={"/polls/new"}>
							<AntDesign name="plus" size={20} color="gray" />
						</Link>
					),
					headerLeft: () => (
						<Link href={"/profile"}>
							<AntDesign name="user" size={20} color="gray" />
						</Link>
					),
				}}
			/>
			<FlatList
				data={polls}
				style={{ backgroundColor: "gainsboro" }}
				contentContainerStyle={styles.container}
				renderItem={({ item }) => (
					<Link href={`/polls/${item.id}`} style={styles.pollContainer}>
						<Text style={styles.pollTitle}>
							{item.id}: Example poll question
						</Text>
					</Link>
				)}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		gap: 5,
	},

	pollContainer: {
		backgroundColor: "#fff",
		padding: 10,
		borderRadius: 5,
	},

	pollTitle: {
		fontSize: 16,
		fontWeight: "bold",
	},
});
