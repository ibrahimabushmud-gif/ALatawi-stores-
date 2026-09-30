import { getSettings } from "@/lib/settings";
import CheckoutClient from "@/components/store/CheckoutClient";

export default async function CheckoutPage() {
  const settings = await getSettings();
  return (
    <div className="container-x" style={{ paddingTop: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 20px" }}>إتمام الشراء</h1>
      <CheckoutClient settings={settings} />
    </div>
  );
}
