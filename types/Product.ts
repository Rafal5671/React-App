export interface Product {
    id: number;
    productName: string;
    image: string;
    price: number;
    cutPrice?: number | null;
    quantity: number;
    description: string;
    rating:number;
    reviewCount: number;
    comments?: { id: number; rating: number; description: string; username: string }[];
}
