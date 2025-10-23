import { Model } from 'sequelize';
export declare class Product extends Model {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Product;
//# sourceMappingURL=Product.d.ts.map