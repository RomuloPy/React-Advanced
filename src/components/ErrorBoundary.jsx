import { Component } from "react";
import { Flex, Heading, Text } from "@chakra-ui/react";

export class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.log(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			const footerHeight = 10;
			const minHeight = `calc(100vh - ${footerHeight}rem)`;

			return (
				<>
					<Flex
						direction={"column"}
						justifyContent={"center"}
						alignItems={"center"}
						minHeight={minHeight}
						textAlign={"center"}
					>
						<Heading color={"red.500"} fontSize={{ base: "4xl", md: "5xl" }}>
							Oh no!
						</Heading>
						<Heading
							color={"red.500"}
							fontSize={{ base: "3xl", md: "4xl" }}
							p={{ base: 2, md: 4 }}
						>
							An error occurred, please try again later.
						</Heading>

						<Text
							color={"teal.700"}
							fontSize={{ base: "lg", md: "xl" }}
							p={{ base: 2, md: 4 }}
						>
							Error: {this.state.error?.message}
						</Text>
					</Flex>
				</>
			);
		}

		return this.props.children;
	}
}
