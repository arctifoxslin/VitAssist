import { NavigatorScreenParams } from "@react-navigation/native"
import { IntakeNavigationStack } from "../../features/intake/IntakeNavigationStack"
import { ProductsNavigationStack } from "../../features/products/ProductsNavigationStack"

export type AppNavigationStack = {
  ScheduleNavigationMap: { headerTitle?: string } | undefined
  ProductsNavigationMap: NavigatorScreenParams<ProductsNavigationStack> & { headerTitle?: string }
  IntakeNavigationMap: NavigatorScreenParams<IntakeNavigationStack> & { headerTitle?: string }
}
