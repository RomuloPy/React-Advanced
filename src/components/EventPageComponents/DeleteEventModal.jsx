import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Text,
} from "@chakra-ui/react";

export const DeleteEventModal = ({ event, isOpen, onClose, deleteEvent }) => {
	return (
		<Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<ModalBody textAlign={"center"} mt={10}>
					<Text>Are you sure you want to delete this event?</Text>
				</ModalBody>

				<ModalFooter>
					<Button colorScheme="teal" w={"70px"} mr={3} onClick={deleteEvent}>
						Yes
					</Button>
					<Button
						color={"pink.700"}
						backgroundColor={"gray.200"}
						_hover={{ backgroundColor: "gray.300" }}
						w={"70px"}
						variant="ghost"
						onClick={onClose}
					>
						No
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
