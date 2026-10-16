import ShopScreen from "@/screens/ShopScreen";
import { getShopCatalog } from "@/lib/api";

export default async function ShopPage() {
  const { products, categories } = await getShopCatalog();
  return <ShopScreen products={products} categories={categories} />;
}
