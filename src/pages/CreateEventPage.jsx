import { useLoaderData, Form, redirect } from "react-router-dom";
import {
	Box,
	Center,
	FormControl,
	Heading,
	Input,
	InputGroup,
	InputLeftAddon,
	Stack,
	Button,
	ButtonGroup,
	useToast,
	Checkbox,
	Grid,
	Select,
} from "@chakra-ui/react";
import { HomeButton } from "../components/HomeButton";

// Loader function
export const loader = async () => {
	try {
		const categories = await fetch("http://localhost:3000/categories");
		const users = await fetch("http://localhost:3000/users");
		return {
			categories: await categories.json(),
			users: await users.json(),
		};
	} catch (err) {
		console.error(err);
	}
};

// Create event action
export const action = async ({ request }) => {
	const formData = Object.fromEntries(await request.formData());

	formData.createdBy = parseInt(formData.userId);

	formData.startTime = new Date(formData.startTime).toISOString();

	if (formData.endTime) {
		formData.endTime = new Date(formData.endTime).toISOString();
	}

	// Checked categories returned as an array
	const checkedCategories = Array.from(
		document.querySelectorAll('input[name="categoryIds"]:checked')
	).map((checkbox) => parseInt(checkbox.value));

	formData.categoryIds = checkedCategories;

	// Create event request body in the format the API expects
	const requestBody = {
		id: formData.id,
		createdBy: formData.createdBy,
		title: formData.title,
		description: formData.description,
		image: formData.image,
		categoryIds: formData.categoryIds,
		attendedBy: formData.attendedBy || [],
		location: formData.location,
		startTime: formData.startTime,
		endTime: formData.endTime,
	};

	// Create event and get the new event's id from the response
	const newEventId = await fetch("http://localhost:3000/events", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(requestBody),
	})
		.then((res) => res.json())
		.then((json) => json.id);

	return redirect(`/event/${newEventId}`);
};
// CreateEventPage component
export const CreateEventPage = () => {
	const { categories, users } = useLoaderData();
	const toast = useToast();
	const id = "create-event-toast";

	return (
		<>
			<Box
				my={{ base: "4", md: "16" }}
				mx={{ base: "1", md: "16", lg: "36" }}
				backgroundColor={"whiteAlpha.700"}
				borderRadius={10}
			>
				{/* Heading */}
				<Center p={{ base: "4", md: "8" }}>
					<Heading color={"teal.400"} fontSize={{ base: "4xl", md: "5xl" }}>
						Create Event
					</Heading>
				</Center>

				{/* New Event Form */}
				<Form method="POST" id="new-event-form">
					<Stack spacing={4} p={{ base: "4", md: "8" }}>
						{/* User selection field */}
						<FormControl id="Users">
							<InputGroup size={{ base: "sm", md: "md" }}>
								<InputLeftAddon children="User" />
								<Select
									name="userId"
									focusBorderColor="teal.400"
									placeholder=" "
								>
									{users.map((user) => {
										console.log("user", user);
										return (
											<option key={user.id} value={user.id}>
												{user.name}
											</option>
										);
									})}
								</Select>
							</InputGroup>
						</FormControl>

						{/* Title Field*/}
						<FormControl id="title" isRequired>
							<InputGroup size={{ base: "sm", md: "md" }}>
								<InputLeftAddon children="Title" />
								<Input type="text" name="title" focusBorderColor="teal.400" />
							</InputGroup>
						</FormControl>
						{/* Description Field*/}
						<FormControl id="description">
							<InputGroup size={{ base: "sm", md: "md" }}>
								<InputLeftAddon children="Description" />
								<Input
									type="text"
									name="description"
									focusBorderColor="teal.400"
								/>
							</InputGroup>
						</FormControl>
						{/* Image url field*/}
						<FormControl id="image-URL">
							<InputGroup size={{ base: "sm", md: "md" }}>
								<InputLeftAddon children="Image URL" />
								<Input type="text" name="image" focusBorderColor="teal.400" />
							</InputGroup>
						</FormControl>

						{/* Start Date and Time */}
						<FormControl id="startTime" isRequired>
							<InputGroup size={{ base: "sm", md: "md" }}>
								<InputLeftAddon children="Start" />
								<Stack spacing={5}>
									<Input
										type="datetime-local"
										name="startTime"
										focusBorderColor="teal.400"
										size={{ base: "sm", md: "md" }}
									/>
								</Stack>
							</InputGroup>
						</FormControl>
						{/* End Date and Time */}
						<FormControl id="endTime">
							<InputGroup size={{ base: "sm", md: "md" }}>
								<InputLeftAddon children="End" />
								<Stack spacing={5}>
									<Input
										type="datetime-local"
										name="endTime"
										focusBorderColor="teal.400"
										size={{ base: "sm", md: "md" }}
									/>
								</Stack>
							</InputGroup>
						</FormControl>

						{/* Location field */}
						<FormControl id="location">
							<InputGroup size={{ base: "sm", md: "md" }}>
								<InputLeftAddon children="Location" />
								<Input
									type="text"
									name="location"
									focusBorderColor="teal.400"
								/>
							</InputGroup>
						</FormControl>

						{/* Categories check boxes*/}
						<FormControl id="category">
							<InputGroup size={{ base: "sm", md: "md" }}>
								<InputLeftAddon
									children="Category"
									mt={{ base: "2", md: "1" }}
								/>
								<Grid>
									{categories.map((category) => (
										<Checkbox
											key={category.id}
											value={category.id}
											name="categoryIds"
											multiple={true}
											mx={{ base: "8", md: "24" }}
											colorScheme="teal"
											onChange={(e) => {
												const checkedCategories = Array.from(
													document.querySelectorAll(
														'input[name="categoryIds"]:checked'
													)
												).map((checkbox) => checkbox.value);
												document.getElementById("category").value =
													checkedCategories;

												if (!e.target.checked) {
													checkedCategories.splice(
														checkedCategories.indexOf(e.target.value),
														1
													);
												}
												document.getElementById("category").value =
													checkedCategories;

												if (checkedCategories.length === 0) {
													document.getElementById("category").value = null;
												}
											}}
										>
											{category.name}
										</Checkbox>
									))}
								</Grid>
							</InputGroup>
						</FormControl>

						{/* Form submit Button */}
						<ButtonGroup alignSelf={"end"}>
							<Button
								type="submit"
								colorScheme="teal"
								m={2}
								onClick={() => {
									if (
										document.getElementById("new-event-form").checkValidity()
									) {
										toast({
											id,
											title: "Event created.",
											status: "success",
											duration: 5000,
											isClosable: true,
										});
									}
								}}
							>
								Submit
							</Button>
							<Button
								type="reset"
								color={"gray.700"}
								backgroundColor={"gray.100"}
								variant="ghost"
								_hover={{ backgroundColor: "gray.200" }}
								m={2}
							>
								Clear
							</Button>
						</ButtonGroup>
					</Stack>
				</Form>

				{/* Back Home Button */}
			</Box>
			<Center>
				<HomeButton />
			</Center>
		</>
	);
};
