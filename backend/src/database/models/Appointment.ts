import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

export interface AppointmentAttributes {
  id?: string;
  customerId: string;
  staffId: string;
  customerName?: string;
  staffName?: string;
  service: string;
  date: Date;
  time: string;
  duration?: number;
  price?: number;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Appointment extends Model<AppointmentAttributes> implements AppointmentAttributes {
  declare id: string;
  declare customerId: string;
  declare staffId: string;
  declare customerName: string | null;
  declare staffName: string | null;
  declare service: string;
  declare date: Date;
  declare time: string;
  declare duration: number;
  declare price: number;
  declare status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  declare notes: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Appointment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: '客户ID'
    },
    staffId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: '美容师ID'
    },
    customerName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '客户名称'
    },
    staffName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '美容师名称'
    },
    service: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '服务项目'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '预约日期'
    },
    time: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: '预约时间'
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
      comment: '时长（分钟）'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      comment: '价格'
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      defaultValue: 'pending',
      comment: '状态'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '备注'
    }
  },
  {
    sequelize,
    tableName: 'appointments',
    timestamps: true,
    underscored: true
  }
);

export default Appointment;

import sequelize from '../../config/database';

export interface AppointmentAttributes {
  id?: string;
  customerId: string;
  staffId: string;
  customerName?: string;
  staffName?: string;
  service: string;
  date: Date;
  time: string;
  duration?: number;
  price?: number;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Appointment extends Model<AppointmentAttributes> implements AppointmentAttributes {
  declare id: string;
  declare customerId: string;
  declare staffId: string;
  declare customerName: string | null;
  declare staffName: string | null;
  declare service: string;
  declare date: Date;
  declare time: string;
  declare duration: number;
  declare price: number;
  declare status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  declare notes: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Appointment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: '客户ID'
    },
    staffId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: '美容师ID'
    },
    customerName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '客户名称'
    },
    staffName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '美容师名称'
    },
    service: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '服务项目'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '预约日期'
    },
    time: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: '预约时间'
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
      comment: '时长（分钟）'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      comment: '价格'
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      defaultValue: 'pending',
      comment: '状态'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '备注'
    }
  },
  {
    sequelize,
    tableName: 'appointments',
    timestamps: true,
    underscored: true
  }
);

export default Appointment;

import sequelize from '../../config/database';

export interface AppointmentAttributes {
  id?: string;
  customerId: string;
  staffId: string;
  customerName?: string;
  staffName?: string;
  service: string;
  date: Date;
  time: string;
  duration?: number;
  price?: number;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Appointment extends Model<AppointmentAttributes> implements AppointmentAttributes {
  declare id: string;
  declare customerId: string;
  declare staffId: string;
  declare customerName: string | null;
  declare staffName: string | null;
  declare service: string;
  declare date: Date;
  declare time: string;
  declare duration: number;
  declare price: number;
  declare status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  declare notes: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Appointment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: '客户ID'
    },
    staffId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: '美容师ID'
    },
    customerName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '客户名称'
    },
    staffName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '美容师名称'
    },
    service: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '服务项目'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '预约日期'
    },
    time: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: '预约时间'
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
      comment: '时长（分钟）'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      comment: '价格'
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      defaultValue: 'pending',
      comment: '状态'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '备注'
    }
  },
  {
    sequelize,
    tableName: 'appointments',
    timestamps: true,
    underscored: true
  }
);

export default Appointment;







