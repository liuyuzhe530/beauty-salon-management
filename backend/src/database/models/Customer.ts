import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

export interface CustomerAttributes {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  totalSpending?: number;
  appointmentCount?: number;
  preferredStaff?: string;
  status?: 'active' | 'atrisk' | 'inactive';
  lastVisit?: Date;
  photo?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Customer extends Model<CustomerAttributes> implements CustomerAttributes {
  declare id: string;
  declare name: string;
  declare phone: string;
  declare email: string | null;
  declare totalSpending: number;
  declare appointmentCount: number;
  declare preferredStaff: string | null;
  declare status: 'active' | 'atrisk' | 'inactive';
  declare lastVisit: Date | null;
  declare photo: string | null;
  declare notes: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Customer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '客户名称'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: '电话号码'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      },
      comment: '邮箱'
    },
    totalSpending: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      comment: '总消费金额'
    },
    appointmentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '预约次数'
    },
    preferredStaff: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: '首选美容师'
    },
    status: {
      type: DataTypes.ENUM('active', 'atrisk', 'inactive'),
      defaultValue: 'active',
      comment: '客户状态'
    },
    lastVisit: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最后访问时间'
    },
    photo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '头像'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '备注'
    }
  },
  {
    sequelize,
    tableName: 'customers',
    timestamps: true,
    underscored: true
  }
);

export default Customer;







