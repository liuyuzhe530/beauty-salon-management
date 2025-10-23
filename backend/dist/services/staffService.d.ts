import { BaseService } from './baseService';
export declare class StaffService extends BaseService<any> {
    constructor();
    findByPhone(phone: string): Promise<any>;
    findAvailable(): Promise<any[]>;
    getStats(): Promise<{
        totalStaff: number;
        availableStaff: number;
    }>;
}
declare const _default: StaffService;
export default _default;
//# sourceMappingURL=staffService.d.ts.map