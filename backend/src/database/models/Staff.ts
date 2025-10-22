import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

export interface StaffAttributes {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  specialty?: string[];
  experience?: number;
  rating?: number;
  totalRevenue?: number;
  clientCount?: number;
  status?: 'active' | 'onleave' | 'inactive';
  startDate?: Date;
  photo?: string;
  certifications?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Staff extends Model<StaffAttributes> implements StaffAttributes {
  declare id: string;
  declare name: string;
  declare phone: string;
  declare email: string | null;
  declare specialty: string[];
  declare experience: number;
  declare rating: number;
  declare totalRevenue: number;
  declare clientCount: number;
  declare status: 'active' | 'onleave' | 'inactive';
  declare startDate: Date;
  declare photo: string | null;
  declare certifications: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Staff.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '美容师名称'
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
    specialty: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: '专业特长'
    },
    experience: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '工作年限'
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      comment: '评分'
    },
    totalRevenue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      comment: '总收入'
    },
    clientCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '客户数'
    },
    status: {
      type: DataTypes.ENUM('active', 'onleave', 'inactive'),
      defaultValue: 'active',
      comment: '状态'
    },
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: '入职日期'
    },
    photo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '头像'
    },
    certifications: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '证书'
    }
  },
  {
    sequelize,
    tableName: 'staff',
    timestamps: true,
    underscored: true
  }
);

export default Staff;







