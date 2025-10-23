import { Model, ForeignKey } from 'sequelize';
export declare class Appointment extends Model {
    id: string;
    customerId: ForeignKey<string>;
    staffId: ForeignKey<string>;
    service: string;
    appointmentDate: Date;
    duration: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes: string;
    price: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Appointment;
//# sourceMappingURL=Appointment.d.ts.map