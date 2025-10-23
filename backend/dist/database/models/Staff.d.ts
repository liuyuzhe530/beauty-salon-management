import { Model, ForeignKey } from 'sequelize';
export declare class Staff extends Model {
    id: string;
    userId: ForeignKey<string>;
    firstName: string;
    lastName: string;
    specialization: string;
    phone: string;
    email: string;
    isAvailable: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Staff;
//# sourceMappingURL=Staff.d.ts.map