import { Model, ForeignKey } from 'sequelize';
export declare class Customer extends Model {
    id: string;
    userId: ForeignKey<string>;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    notes: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Customer;
//# sourceMappingURL=Customer.d.ts.map