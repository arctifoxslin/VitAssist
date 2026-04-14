import { NavigatorScreenParams } from "@react-navigation/native"
import { IntakeNavigationStack } from "../../features/intake/IntakeNavigationStack"
import { ProductsNavigationStack } from "../../features/products/ProductsNavigationStack"

export type AppNavigationStack = {
  ScheduleNavigationMap: undefined
  ProductsNavigationMap: NavigatorScreenParams<ProductsNavigationStack>
  IntakeNavigationMap: NavigatorScreenParams<IntakeNavigationStack>
}
