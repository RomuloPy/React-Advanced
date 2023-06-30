import { useLoaderData, useNavigate } from "react-router-dom";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useState, useEffect } from "react";
import {
	Box,
	Heading,
	Image,
	Center,
	Button,
	Stack,
	Text,
	useToast,
	Flex,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { HomeButton } from "../components/HomeButton";
import { EditEventModal } from "../components/EventPageComponents/EditEventModal";
import { DeleteEventModal } from "../components/EventPageComponents/DeleteEventModal";

// Loader function
export const loader = async ({ params }) => {
	try {
		const event = await fetch(`http://localhost:3000/events/${params.eventId}`);
		const categories = await fetch("http://localhost:3000/categories");
		const users = await fetch("http://localhost:3000/users");
		return {
			event: await event.json(),
			categories: await categories.json(),
			users: await users.json(),
		};
	} catch (error) {
		console.error(error);
	}
};

// EventPage component
export const EventPage = () => {
	const { event, categories, users } = useLoaderData();
	const toast = useToast();
	const id = "delete-event-toast";
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [currentEvent, setCurrentEvent] = useState(event);
	const [componentKey, setComponentKey] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		setComponentKey((prevKey) => prevKey + 1);
	}, [event]);

	// Update event action
	const updateEvent = async (updatedEvent) => {
		await fetch(`http://localhost:3000/events/${event.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updatedEvent),
		});
		setCurrentEvent(updatedEvent);
	};

	// Force component update
	const forceComponetUpdate = () => {
		setComponentKey((prevKey) => prevKey + 1);
	};
	const deleteEvent = async () => {
		try {
			await fetch(`http://localhost:3000/events/${currentEvent.id}`, {
				method: "DELETE",
			});
			toast({
				id,
				title: "Event deleted.",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
			navigate("/");
		} catch (error) {
			console.error("Error deleting event:", error);
			toast({
				id,
				description: "Error deleting event.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	return (
		<Box mx={{ base: "8", md: "1" }} color={"teal.500"} key={componentKey}>
			{/* Event Title */}
			<Center>
				<Heading
					p={{ base: "4", md: "8" }}
					fontSize={{ base: "4xl", md: "5xl" }}
					textAlign={"center"}
				>
					{currentEvent.title}
				</Heading>
			</Center>

			{/* Event Image */}
			<Center>
				<Image
					src={currentEvent.image || "../../Logo/logo.png"}
					alt={currentEvent.title}
					boxSize={{ base: "xs", md: "sm" }}
					objectFit={"cover"}
					borderRadius={"10px"}
					position={"relative"}
				/>
			</Center>

			{/* Event Description */}
			<Center p={{ base: "4", md: "8" }} color={"pink.700"}>
				<Text>{currentEvent.description}</Text>
			</Center>

			<Flex
				direction={"column"}
				justifyContent={"center"}
				alignItems={"center"}
				fontSize={{ base: "xs", md: "sm", lg: "md" }}
				gap={4}
			>
				{/* Event starting and ending time */}
				<Box>
					<Stack direction={"row"} spacing={4}>
						{currentEvent.startTime && (
							<>
								<Text>Start:</Text>
								<Text>
									{new Date(currentEvent.startTime).toString() ===
									"Invalid Date"
										? ""
										: new Date(currentEvent.startTime)
												.toLocaleString([], {
													dateStyle: "short",
													timeStyle: "short",
													hour24: true,
												})
												.replace(",", "")}
								</Text>
							</>
						)}
						{currentEvent.endTime && (
							<>
								<Text>End:</Text>
								<Text>
									{new Date(currentEvent.endTime).toString() === "Invalid Date"
										? ""
										: new Date(currentEvent.endTime)
												.toLocaleString([], {
													dateStyle: "short",
													timeStyle: "short",
													hour24: true,
												})
												.replace(",", "")}
								</Text>
							</>
						)}
					</Stack>
				</Box>
				{/*Location*/}
				<Box>
					<Stack direction={"row"} spacing={4}>
						<Text>Location:</Text>
						<Text>{currentEvent.location}</Text>
					</Stack>
				</Box>
				{/* Event Categories */}
				<Box>
					<Stack direction={"row"} spacing={4}>
						<Text>Categories:</Text>
						{currentEvent.categoryIds &&
							categories
								.filter(
									(category) =>
										currentEvent.categoryIds &&
										currentEvent.categoryIds.includes(category.id)
								)
								.map((category) => (
									<Text key={category.id}>{category.name}</Text>
								))}
					</Stack>
				</Box>
			</Flex>

			{/* Created By */}
			<Box m={"8"} color={"pink.700"}>
				<Center>
					<Stack direction={"row"}>
						<Text>Created By:</Text>
						<Text>
							{currentEvent.createdBy &&
								users
									.filter((user) => user.id === currentEvent.createdBy)
									.map((user) => user.name)}
						</Text>
					</Stack>
				</Center>
				{/* User Photo */}
				<Center>
					<Image
						src={
							currentEvent.createdBy &&
							users.find((user) => user.id === currentEvent.createdBy).image
						}
						alt={
							event.createdBy &&
							users.find((user) => user.id === currentEvent.createdBy).name
						}
						boxSize={{ base: "80px", md: "100px" }}
						objectFit={"cover"}
						borderRadius={"50%"}
						position={"relative"}
						m={2}
					/>
				</Center>
			</Box>

			{/* Edit and Delete Buttons */}
			<Center>
				<Button
					colorScheme="teal"
					w={{ base: "70px", md: "80px" }}
					m={4}
					onClick={() => setIsModalOpen(true)}
				>
					Edit
				</Button>
				<Button
					color={"pink.700"}
					w={{ base: "70px", md: "80px" }}
					backgroundColor={"gray.200"}
					_hover={{ backgroundColor: "gray.300" }}
					m={2}
					onClick={() => setIsDeleteModalOpen(true)}
				>
					<DeleteIcon boxSize={{ base: "4", md: "5" }} />
				</Button>
			</Center>

			{/* Back Home icon */}
			<Center>
				<HomeButton />
			</Center>

			{/* Edit Event Modal */}
			<ErrorBoundary>
				<EditEventModal
					isOpen={isModalOpen}
					onClose={() => {
						setIsModalOpen(false);
					}}
					event={currentEvent}
					categories={categories}
					updateEvent={updateEvent}
					forceComponetUpdate={forceComponetUpdate}
				/>
			</ErrorBoundary>
			<ErrorBoundary>
				<DeleteEventModal
					isOpen={isDeleteModalOpen}
					onClose={() => setIsDeleteModalOpen(false)}
					deleteEvent={deleteEvent}
					event={currentEvent}
				/>
			</ErrorBoundary>
		</Box>
	);
};
