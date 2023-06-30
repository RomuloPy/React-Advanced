import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const AddNewEventButton = () => {
	return (
		<Button
			as={Link}
			to="/create-event"
			colorScheme={"teal"}
			variant={"outline"}
			_hover={{ backgroundColor: "whiteAlpha.900" }}
			size={{ base: "sm", md: "md" }}
			p={6}
		>
			Add New Event
		</Button>
	);
};
