import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProductOffer {
  id: string;
  productIds: string[]; // IDs of products this offer applies to
  title: string;
  description: string;
  discountType: "percentage" | "fixed" | "bogo"; // Buy One Get One
  discountValue: number; // Percentage or fixed amount
  minQuantity?: number; // Minimum quantity for BOGO offers
  category: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isHot: boolean;
  isNew: boolean;
  tags: string[];
}

interface OffersState {
  offers: ProductOffer[];
  activeOffers: ProductOffer[];
}

interface OffersActions {
  getOffersForProduct: (productId: string) => ProductOffer[];
  calculateDiscountedPrice: (
    originalPrice: number,
    productId: string
  ) => number;
  getActiveOffers: () => ProductOffer[];
}

type OffersStore = OffersState & OffersActions;

// Sample offers data
const sampleOffers: ProductOffer[] = [
  {
    id: "offer-1",
    productIds: ["8737637", "87377"], // Lime products
    title: "Fresh Lime Sale",
    description: "Get 20% off on all lime products",
    discountType: "percentage",
    discountValue: 20,
    category: "Fruits & Vegetables",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    isActive: true,
    isHot: true,
    isNew: false,
    tags: ["Sale", "Lime", "Fresh"],
  },
  {
    id: "offer-2",
    productIds: ["84738", "84739"], // Apple and Carrot
    title: "Organic Bundle",
    description: "Buy 2 organic products, get 15% off",
    discountType: "percentage",
    discountValue: 15,
    minQuantity: 2,
    category: "Fruits & Vegetables",
    startDate: "2024-01-01",
    endDate: "2024-02-15",
    isActive: true,
    isHot: false,
    isNew: true,
    tags: ["Organic", "Bundle", "Discount"],
  },
  {
    id: "offer-3",
    productIds: ["84737"], // Cherries
    title: "Cherry Blast",
    description: "Fresh cherries at 25% off",
    discountType: "percentage",
    discountValue: 25,
    category: "Fruits & Vegetables",
    startDate: "2024-01-15",
    endDate: "2024-01-25",
    isActive: true,
    isHot: true,
    isNew: true,
    tags: ["Cherries", "Flash Sale", "Limited Time"],
  },
  {
    id: "offer-4",
    productIds: ["87337"], // Corn
    title: "Sweet Corn Special",
    description: "Get ₦50 off on sweet corn",
    discountType: "fixed",
    discountValue: 50,
    category: "Fruits & Vegetables",
    startDate: "2024-01-10",
    endDate: "2024-01-30",
    isActive: true,
    isHot: false,
    isNew: false,
    tags: ["Corn", "Fixed Discount", "Special"],
  },
];

export const useOffersStore = create<OffersStore>()(
  persist(
    (_, get) => ({
      offers: sampleOffers,
      activeOffers: sampleOffers.filter((offer) => offer.isActive),

      getOffersForProduct: (productId) => {
        const { offers } = get();
        const now = new Date();
        return offers.filter((offer) => {
          const isActive = offer.isActive;
          const isInDateRange =
            new Date(offer.startDate) <= now && new Date(offer.endDate) >= now;
          const appliesToProduct = offer.productIds.includes(productId);
          return isActive && isInDateRange && appliesToProduct;
        });
      },

      calculateDiscountedPrice: (originalPrice, productId) => {
        const productOffers = get().getOffersForProduct(productId);
        if (productOffers.length === 0) return originalPrice;

        // Get the best offer (highest discount)
        const bestOffer = productOffers.reduce((best, current) => {
          let currentDiscount = 0;
          let bestDiscount = 0;

          if (current.discountType === "percentage") {
            currentDiscount = (originalPrice * current.discountValue) / 100;
          } else if (current.discountType === "fixed") {
            currentDiscount = current.discountValue;
          }

          if (best.discountType === "percentage") {
            bestDiscount = (originalPrice * best.discountValue) / 100;
          } else if (best.discountType === "fixed") {
            bestDiscount = best.discountValue;
          }

          return currentDiscount > bestDiscount ? current : best;
        });

        let discountedPrice = originalPrice;

        if (bestOffer.discountType === "percentage") {
          discountedPrice =
            originalPrice - (originalPrice * bestOffer.discountValue) / 100;
        } else if (bestOffer.discountType === "fixed") {
          discountedPrice = Math.max(
            0,
            originalPrice - bestOffer.discountValue
          );
        }

        return Math.round(discountedPrice);
      },

      getActiveOffers: () => {
        const { offers } = get();
        const now = new Date();
        return offers.filter((offer) => {
          const isActive = offer.isActive;
          const isInDateRange =
            new Date(offer.startDate) <= now && new Date(offer.endDate) >= now;
          return isActive && isInDateRange;
        });
      },
    }),
    {
      name: "offers-storage",
      partialize: (state) => ({ offers: state.offers }),
    }
  )
);

// Selector hooks
export const useOffers = () => useOffersStore((state) => state.offers);
export const useActiveOffers = () =>
  useOffersStore((state) => state.activeOffers);
