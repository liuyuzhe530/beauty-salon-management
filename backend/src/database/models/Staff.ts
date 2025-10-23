import { DataTypes, Model, ForeignKey } from 'sequelize';
import sequelize from '../../config/database';
import { User } from './User';

export class Staff extends Model {
  public id!: string;
  public userId!: ForeignKey<string>;
  public firstName!: string;
  public lastName!: string;
  public specialization!: string;
  public phone!: string;
  public email!: string;
  public isAvailable!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Staff.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: User, key: 'id' },
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    specialization: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'staff',
  }
);

export default Staff;




