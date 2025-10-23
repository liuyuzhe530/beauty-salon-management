import { BaseService } from './baseService';
export declare class ProductService extends BaseService<any> {
    constructor();
    findByCategory(category: string): Promise<any[]>;
    findActive(): Promise<any[]>;
    searchByName(name: string): Promise<any[]>;
    getStats(): Promise<{
        totalProducts: number;
        activeProducts: number;
    }>;
}
declare const _default: ProductService;
export default _default;
//# sourceMappingURL=productService.d.ts.map