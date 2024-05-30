import { AntDesign } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

const polls = [{ id: 1 }, { id: 2 }, { id: 3 }];

export default function HomeScreen() {
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
