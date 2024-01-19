export interface AssetAttributes {
    id?: number;
    assetTag: string;
    name: string;
    serialNumber?: string;
    modelNumber?: string;
    purchaseDate?: Date;
    purchaseCost?: Number;
    nextAuditDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface LocationAttributes {
    id?: number;
    locationName: string;
    geoLocation?: JSON;
    primaryLocation: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}