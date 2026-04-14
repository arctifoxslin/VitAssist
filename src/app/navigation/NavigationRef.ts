import { createNavigationContainerRef } from "@react-navigation/native";
import { AppNavigationStack } from "./AppNavigationStack";

export const navigationRef = createNavigationContainerRef<AppNavigationStack>()