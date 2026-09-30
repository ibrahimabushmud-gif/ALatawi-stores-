import { db } from "./db";
import { cache } from "react";

export const getSettings = cache(async () => {
  const settings = await db.setting.findFirst({
    include: {
      store: true,
      theme: true,
      seo: true,
      shipping: { include: { cities: true } },
      payments: true,
      social: true,
    },
  });

  if (!settings) {
    return {
      store: { name: "متجر العطاوي", logo: "", phone: "", email: "", address: "" },
      theme: {
        primary: "#2563eb",
        secondary: "#64748b",
        bg: "#ffffff",
        text: "#0f172a",
        btn: "#2563eb",
        discount: "#dc2626",
        radius: 12,
        font: "Tajawal",
        headerStyle: "default",
        footerStyle: "default",
      },
      seo: {
        siteTitle: "متجر العطاوي",
        metaDescription: "",
        keywords: "",
      },
      shipping: {
        defaultFee: 15,
        freeShippingEnabled: false,
        freeShippingMin: 200,
        cities: [],
      },
      payments: {
        cod: { enabled: true, label: "الدفع عند الاستلام" },
        bank: { enabled: false, label: "تحويل بنكي", details: "" },
        card: { enabled: false, label: "بطاقة ائتمان" },
      },
      social: {
        facebook: "",
        twitter: "",
        instagram: "",
        snapchat: "",
        tiktok: "",
      },
    };
  }

  return settings;
});
