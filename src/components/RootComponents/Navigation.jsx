import { Link } from "react-router-dom";
import { Box, Flex, Image } from "@chakra-ui/react";

export const Navigation = () => {
	return (
		<Box backgroundColor={""}>
			<Flex justifyContent={{ base: "center", md: "center" }} p={1}>
				<Link to="/">
					<Flex>
						<Image
							src="../../Logo/logo.png"
							width="300px"
						/>
					</Flex>
				</Link>
			</Flex>
		</Box>
	);
};
