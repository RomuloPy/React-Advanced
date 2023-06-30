import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { EventPage, loader as eventPageLoader } from "./pages/EventPage";
import {
	EventsListPage,
	loader as eventsListPageLoader,
} from "./pages/EventsListPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";
import {
	CreateEventPage,
	loader as createEventLoader,
	action as createEventAction,
} from "./pages/CreateEventPage";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Routeer with root and children
const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,

		children: [
			{
				path: "/",
				element: <EventsListPage />,
				loader: eventsListPageLoader,
			},
			{
				path: "/event/:eventId",
				element: <EventPage />,
				loader: eventPageLoader,
				// action: addComment,
			},
			{
				path: "/create-event",
				element: <CreateEventPage />,
				loader: createEventLoader,
				action: createEventAction,
			},
		],
	},
]);

// Main render
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ChakraProvider>
			<ErrorBoundary>
				<RouterProvider router={router} />
			</ErrorBoundary>
		</ChakraProvider>
	</React.StrictMode>
);
