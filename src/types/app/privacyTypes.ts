export interface cancellationPolicyTypes {
  bookingRemarks: string;
  cancellationPolicies: {
    cancellationFee: {
      currency: string;
      supplierCurrency: string;
      finalPrice: number;
      finalPriceInSupplierCurrency: number;
      originalPrice: number;
      originalPriceInSupplierCurrency: number;
    };
    dateFrom: string;
    dateTo: string;
  }[];
}
