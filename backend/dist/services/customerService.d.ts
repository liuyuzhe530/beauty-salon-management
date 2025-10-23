import { BaseService } from './baseService';
export declare class CustomerService extends BaseService<any> {
    constructor();
    findByPhone(phone: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    getStats(): Promise<{
        totalCustomers: number;
    }>;
}
declare const _default: CustomerService;
export default _default;
//# sourceMappingURL=customerService.d.ts.map