export interface Product {
    id: number;
    productName: string;
    image: string;
    price: number;
    cutPrice?: number | null; // Opcjonalne pole
    quantity: number;
    description: string;
    rating:number;
    comments?: { id: number; rating: number; description: string; username: string }[];
}
