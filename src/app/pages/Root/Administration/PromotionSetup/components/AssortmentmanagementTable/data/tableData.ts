export const data: AssortmentPromotionTwoType[] = [
  {
    id: "asrt001",
    assortmentName: "Winter Essentials",
    status: "success",
    totalProducts: 20,
    creationDate: "2024-11-01",
    salesGenerated: 1200,
  },
  {
    id: "asrt002",
    assortmentName: "Back-to-School Bundle",
    status: "failed",
    totalProducts: 15,
    creationDate: "2024-10-28",
    salesGenerated: 650,
  },
  {
    id: "asrt003",
    assortmentName: "Holiday Gift Set",
    status: "processing",
    totalProducts: 30,
    creationDate: "2024-11-15",
    salesGenerated: 2400,
  },
  {
    id: "asrt004",
    assortmentName: "Clearance Sale",
    status: "success",
    totalProducts: 50,
    creationDate: "2024-09-20",
    salesGenerated: 400,
  },
  {
    id: "asrt005",
    assortmentName: "Summer Promo 2",
    status: "pending",
    totalProducts: 25,
    creationDate: "2024-07-15",
    salesGenerated: 800,
  },
  {
    id: "asrt006",
    assortmentName: "Summer Promo 3",
    status: "pending",
    totalProducts: 25,
    creationDate: "2024-07-15",
    salesGenerated: 3900,
  },
  {
    id: "asrt007",
    assortmentName: "Summer Promo 5",
    status: "pending",
    totalProducts: 30,
    creationDate: "2024-07-15",
    salesGenerated: 1000,
  },
];

   
  export type AssortmentPromotionTwoType = {
    id: string;
    assortmentName: string;
    status: "pending" | "processing" | "success" | "failed";
    totalProducts: number;
    creationDate: string; // Use ISO date format or any date string
    salesGenerated: number; // Sales in USD or other currency
  };