import { DataTypes, Model, ForeignKey } from 'sequelize';
import sequelize from '../../config/database';
import { Customer } from './Customer';
import { Staff } from './Staff';

export class Appointment extends Model {
  public id!: string;
  public customerId!: ForeignKey<string>;
  public staffId!: ForeignKey<string>;
  public service!: string;
  public appointmentDate!: Date;
  public duration!: number;
  public status!: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  public notes!: string;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Customer, key: 'id' },
    },
    staffId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Staff, key: 'id' },
    },
    service: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'appointments',
  }
);

export default Appointment;




