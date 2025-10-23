import { BaseService } from './baseService';
export declare class AppointmentService extends BaseService<any> {
    constructor();
    findByCustomer(customerId: string): Promise<any[]>;
    findByStaff(staffId: string): Promise<any[]>;
    findUpcoming(days?: number): Promise<any[]>;
    getStats(): Promise<{
        totalAppointments: number;
        confirmed: number;
        completed: number;
    }>;
}
declare const _default: AppointmentService;
export default _default;
//# sourceMappingURL=appointmentService.d.ts.map