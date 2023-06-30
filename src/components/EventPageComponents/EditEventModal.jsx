import {
	Box,
	Stack,
	Center,
	FormControl,
	Input,
	InputGroup,
	InputLeftAddon,
	Button,
	Checkbox,
	Grid,
	useToast,
	Modal,
	ModalBody,
	ModalHeader,
	ModalOverlay,
	ModalContent,
	ButtonGroup,
	Flex,
} from "@chakra-ui/react";
import { useState, useRef } from "react";

export const EditEventModal = ({
	event,
	categories,
	isOpen,
	onClose,
	updateEvent,
	forceComponetUpdate,
}) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const formRef = useRef(null);

	// handleSubmit function
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		// formData object
		const formData = Object.fromEntries(new FormData(formRef.current));
		formData.startTime = new Date(formData.startTime).toISOString();
		if (formData.endTime) {
			formData.endTime = new Date(formData.endTime).toISOString();
		}
		// Checked categories array
		const checkedCategories = Array.from(
			document.querySelectorAll('input[name="categoryIds"]:checked')
		).map((checkbox) => parseInt(checkbox.value));
		formData.categoryIds = checkedCategories;

		// Updated event object
		const updatedEvent = { ...event, ...formData };

		try {
			await updateEvent(updatedEvent);

			toast({
				title: "Event Updated",
				status: "success",
				duration: 5000,
				isClosable: true,
			});

			onClose();
			forceComponetUpdate();
		} catch (error) {
			toast({
				title: "Event Update Failed",
				description: error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				{/* Header */}
				<ModalHeader
					textAlign={"center"}
					fontSize={{ base: "4xl", md: "5xl" }}
					color={"teal.400"}
				>
					Edit Event
				</ModalHeader>
				<ModalBody>
					<Box
						my={{ base: "4", md: "16" }}
						mx={{ base: "1", md: "16", lg: "36" }}
						color={"teal.400"}
					>
						{/* Event Details Edit Form */}
						<Center>
							<form
								ref={formRef}
								method="post"
								action={`/event/${event.id}/edit`}
								size={{ base: "sm", md: "md" }}
							>
								<Stack spacing={4}>
									{/* Title */}
									<FormControl id="title">
										<InputGroup size={{ base: "sm", md: "md" }}>
											<InputLeftAddon children="Title" />
											<Input
												type="text"
												name="title"
												defaultValue={event.title}
											/>
										</InputGroup>
									</FormControl>

									{/* Description */}
									<FormControl id="description">
										<InputGroup size={{ base: "sm", md: "md" }}>
											<InputLeftAddon children="Description" />
											<Input
												type="text"
												name="description"
												defaultValue={event.description}
											/>
										</InputGroup>
									</FormControl>

									{/* Image */}
									<FormControl id="image">
										<InputGroup>
											<InputLeftAddon children="Image" />
											<Input
												type="text"
												name="image"
												defaultValue={event.image}
												placeholder="Event Image URL"
											/>
										</InputGroup>
									</FormControl>

									{/* Start Time */}
									<FormControl id="startTime">
										<InputGroup size={{ base: "sm", md: "md" }}>
											<InputLeftAddon children="Start Time" />
											<Input
												type="datetime-local"
												name="startTime"
												defaultValue={new Date(event.startTime)
													.toISOString()
													.slice(0, -8)}
												placeholder="Event Start Time"
											/>
										</InputGroup>
									</FormControl>

									{/* End Time */}
									<FormControl id="endTime">
										<InputGroup size={{ base: "sm", md: "md" }}>
											<InputLeftAddon children="End Time" />
											<Input
												type="datetime-local"
												name="endTime"
												defaultValue={
													event.endTime
														? new Date(event.endTime).toISOString().slice(0, -8)
														: ""
												}
												placeholder="Event End Time"
											/>
										</InputGroup>
									</FormControl>

									{/* Location */}
									<FormControl id="location">
										<InputGroup size={{ base: "sm", md: "md" }}>
											<InputLeftAddon children="Location" />
											<Input
												type="text"
												name="location"
												defaultValue={event.location}
											/>
										</InputGroup>
									</FormControl>

									{/* Categories */}
									<FormControl id="categoryIds">
										<InputGroup size={{ base: "sm", md: "md" }}>
											<InputLeftAddon
												children="Category"
												mt={{ base: "2", md: "1" }}
											/>
											<Grid>
												{categories.map((category) => (
													<Checkbox
														key={category.id}
														name="categoryIds"
														value={category.id}
														mx={{ base: "8", md: "24" }}
														colorScheme={"teal"}
														defaultChecked={event.categoryIds.includes(
															category.id
														)}
													>
														{category.name}
													</Checkbox>
												))}
											</Grid>
										</InputGroup>
									</FormControl>
								</Stack>

								{/* Submit and Cancel Buttons */}
								<Flex justifyContent={"end"}>
									<ButtonGroup m={4}>
										<Button
											type="submit"
											colorScheme="teal"
											w={{ base: "70px", md: "80px" }}
											m={2}
											isLoading={isSubmitting}
											onClick={handleSubmit}
										>
											Submit
										</Button>
										<Button
											color={"gray.700"}
											w={{ base: "70px", md: "80px" }}
											backgroundColor={"gray.100"}
											variant="ghost"
											_hover={{ backgroundColor: "gray.200" }}
											m={2}
											onClick={onClose}
											isDisabled={isSubmitting}
										>
											Cancel
										</Button>
									</ButtonGroup>
								</Flex>
							</form>
						</Center>
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
