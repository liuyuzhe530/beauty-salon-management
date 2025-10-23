import { Model } from 'sequelize';
export declare class User extends Model {
    id: string;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'staff' | 'customer';
    isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default User;
//# sourceMappingURL=User.d.ts.map