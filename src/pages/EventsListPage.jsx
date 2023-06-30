import { useLoaderData, Link } from "react-router-dom";
import { useState } from "react";
import {
	Heading,
	Image,
	Text,
	List,
	Stack,
	Flex,
	Center,
	Input,
	Box,
	Select,
} from "@chakra-ui/react";
import { AddNewEventButton } from "../components/EventListPageComponents/AddNewEventButton";

// Loader function
export const loader = async () => {
	try {
		const events = await fetch("http://localhost:3000/events");
		const categories = await fetch("http://localhost:3000/categories");
		return { events: await events.json(), categories: await categories.json() };
	} catch (error) {
		console.error(error);
	}
};

// EventsPage component
export const EventsListPage = () => {
	const { events, categories } = useLoaderData();
	const [searchInput, setSearchInput] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");

	// Search input handler
	const handleSearchInputChange = (e) => {
		setSearchInput(e.target.value);
	};

	// Category select handler
	const handleCategorySelect = (e) => {
		setSelectedCategory(e.target.value);
	};

	// Filter and sort events
	const selectedEvents = events
		.filter((eventItem) => {
			const isIncludedInTitle =
				eventItem.title &&
				eventItem.title.toLowerCase().includes(searchInput.toLowerCase());
			if (selectedCategory === "all") {
				return isIncludedInTitle;
			}
			const isIncludedInCategory =
				eventItem.categoryIds?.includes(parseInt(selectedCategory)) || false;
			return isIncludedInTitle && isIncludedInCategory;
		})
		.sort((a, b) => {
			if (a.startTime && b.startTime) {
				return new Date(a.startTime) - new Date(b.startTime);
			}
			if (a.startTime && !b.startTime) {
				return -1;
			}
			if (!a.startTime && b.startTime) {
				return 1;
			}
			return 0;
		});

	return (
		<Box mx={{ base: "12", md: "2" }} color={"teal.400"}>
			{/* Title */}
			<Center p={8} m={3}>
				<Heading fontSize={{ base: "4xl", md: "5xl" }}>Event Creator</Heading>
			</Center>

			{/* Search Input Field */}
			<Center>
				<Stack
					direction={{ base: "column", md: "row" }}
					spacing={4}
					mb={{ base: 8, md: 12 }}
				>
					<Input
						type="search"
						placeholder="Search Events..."
						width={{ base: "300px", md: "400px" }}
						backgroundColor={"whiteAlpha.700"}
						focusBorderColor="teal.400"
						value={searchInput}
						onChange={handleSearchInputChange}
					/>
					<Center>
						<Select
							backgroundColor={"whiteAlpha.700"}
							focusBorderColor="teal.400"
							w={"150px"}
							value={selectedCategory}
							onChange={handleCategorySelect}
						>
							<option value="all">All Categories</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</Select>
					</Center>
				</Stack>
			</Center>

			{/* Create new event top button*/}
			<Box textAlign={{ base: "center", md: "left" }} mt={4} mb={4}>
				<AddNewEventButton />
			</Box>
			{/* Events List */}
			{selectedEvents.map((eventItem) => (
				<List
					key={eventItem.id}
					backgroundColor={"whiteAlpha.700"}
					_hover={{ backgroundColor: "whiteAlpha.900" }}
					my={{ base: 4, md: 2 }}
					borderRadius={10}
				>
					<Link to={`/event/${eventItem.id}`}>
						<Flex
							justifyContent={{ base: "space-between", md: "flex-start" }}
							flexDir={{ base: "column", md: "row" }}
							alignItems={"center"}
							gap={4}
						>
							{/* Image */}
							<Box>
								<Image
									src={eventItem.image || "../../Logo/logo.png"}
									alt={eventItem.title}
									boxSize={{ base: "100%", md: "100px" }}
									objectFit={"cover"}
									borderRadius={{ base: "10px 10px 0 0", md: "10px 0 0 10px" }}
									position={"relative"}
								/>
							</Box>

							{/* Event Title */}
							<Box
								w={{ base: "90%", md: "25%" }}
								textAlign={{ base: "center", md: "left" }}
							>
								<Text
									fontSize={"lg"}
									fontWeight={"semibold"}
									color={"teal.500"}
								>
									{eventItem.title}
								</Text>
							</Box>

							{/* Event Description */}
							<Box
								w={{ base: "90%", md: "30%" }}
								textAlign={{ base: "center", md: "left" }}
								color={"pink.700"}
							>
								<Text>{eventItem.description}</Text>
							</Box>

							{/* Event starting and ending time */}
							{eventItem.startTime || eventItem.endTime ? (
								<Box
									w={{ base: "90%", md: "20%" }}
									textAlign={{ base: "center", md: "left" }}
								>
									<Stack spacing={{ base: "1", md: "2" }}>
										{eventItem.startTime && (
											<Text
												color="teal.500"
												fontSize={{ base: "xs", md: "sm", lg: "md" }}
											>
												Start:{" "}
												{new Date(eventItem.startTime).toLocaleString([], {
													dateStyle: "short",
													timeStyle: "short",
													hour24: true,
												})}
											</Text>
										)}

										{eventItem.endTime && (
											<Text
												color="teal.500"
												fontSize={{ base: "xs", md: "sm", lg: "md" }}
											>
												End:{" "}
												{new Date(eventItem.endTime).toLocaleString([], {
													dateStyle: "short",
													timeStyle: "short",
													hour24: true,
												})}
											</Text>
										)}
									</Stack>
								</Box>
							) : (
								<Box />
							)}

							{/* Event Categories */}
							<Box
								w={{ base: "90%", md: "10%" }}
								color={"teal.500"}
								fontSize={{ base: "sm", md: "md" }}
								mb={{ base: "4", md: "0" }}
							>
								<Flex
									direction={{ base: "row", md: "column" }}
									gap={2}
									justifyContent={"center"}
								>
									{categories
										.filter(
											(category) =>
												eventItem.categoryIds &&
												eventItem.categoryIds.includes(category.id)
										)
										.map((category) => (
											<Text key={category.id}>{category.name}</Text>
										))}
								</Flex>
							</Box>
						</Flex>
					</Link>
				</List>
			))}

			{/* Create new event bottom button*/}
			<Box textAlign={{ base: "center", md: "left" }} mt={4} mb={20}>
				<AddNewEventButton />
			</Box>
		</Box>
	);
};
