import React from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "./RootComponents/Navigation";
import { Footer } from "./RootComponents/Footer";
import { Box, Flex } from "@chakra-ui/react";
import { ErrorBoundary } from "./ErrorBoundary";

export const Root = () => {
	console.log("Inside Root Component");
	return (
		<Box backgroundColor={"gray.100"}>
			<Flex direction={"column"} minHeight={"100vh"}>
				<ErrorBoundary>
					<Navigation />
				</ErrorBoundary>
				<ErrorBoundary>
					<Box flex={"1"}>
						<Outlet />
					</Box>
				</ErrorBoundary>
				<ErrorBoundary>
					<Footer />
				</ErrorBoundary>
			</Flex>
		</Box>
	);
};
