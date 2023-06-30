import { Box, Flex, Text } from "@chakra-ui/react";

export const Footer = () => {
	return (
		<Box backgroundColor={"teal.200"} p={{ base: 4, md: 6 }} mt={4}>
			<Flex justifyContent={"center"}>
				<Text color={"grey"} fontSize={"xs"}>
					© Winc Academy {new Date().getFullYear()}
				</Text>
			</Flex>
		</Box>
	);
};
