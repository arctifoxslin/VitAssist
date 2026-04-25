import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "../types/Product";

const KEY = 'products'

class ProductRepository {
    /*------Get stored products------*/
    async getAll(): Promise<Product[]> {
        try {
            const raw = await AsyncStorage.getItem(KEY)
            if (!raw) return []
            const parsed = JSON.parse(raw)
            if (!Array.isArray(parsed)) {
                console.log("[ProductRepository] Invalid format, resetting storage")
                await this.saveAll([])
                return []
            }

            console.log("[ProductRepository] Loaded:", parsed.length, "products")
            return parsed
        } catch (e) {
            console.log("[ProductRepository: getAll] error", e)
            return []
        }

    }

    /*------Save products to store------*/
    async saveAll(list: Product[]) {
        console.log("[ProductRepository] Saved: ", list.length, " products")
        await AsyncStorage.setItem(KEY, JSON.stringify(list))
    }

    /*------Add new products to store------*/
    async add(item: Product) {
        const list = await this.getAll()
        list.push(item)
        console.log("[ProductRepository] Added: ", item.id)
        await this.saveAll(list)
    }

    async remove(id: string) {
        const list = await this.getAll()
        const filtered = list.filter(n => n.id !== id)
        console.log("[ProductRepository] Removed: ", id)
        await this.saveAll(filtered)
    }

    async update(item: Product) {
        const list = await this.getAll()
        const updated = list.map(p => p.id === item.id ? item : p)

        console.log("[ProductRepository] Updated: ", item.id)
        await this.saveAll(list)
    }

    /*------Find product by id------*/
    async getById(productId: string): Promise<Product | null> {
        try {
            const list = await this.getAll()
            const product = list.find(p => p.id === productId) ?? null

            if (product) {
                console.log("[ProductRepository] FoundById:", product.id)
            } else {
                console.log("[ProductRepository] Not found:", productId)
            }

            return product
        } catch (e) {
            console.log("[ProductRepository: getById] error", e)
            return null
        }
    }

}

export const productRepository = new ProductRepository()