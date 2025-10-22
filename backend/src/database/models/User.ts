import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';
import bcrypt from 'bcryptjs';

export interface UserAttributes {
  id?: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'customer';
  isActive?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  declare id: string;
  declare username: string;
  declare email: string;
  declare password: string;
  declare role: 'admin' | 'staff' | 'customer';
  declare isActive: boolean;
  declare lastLogin: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * 比较密码
   */
  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }

  /**
   * 返回用户信息（不含密码）
   */
  toJSON() {
    const { password, ...rest } = this.get();
    return rest;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '用户名'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      comment: '邮箱'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '密码（已加密）'
    },
    role: {
      type: DataTypes.ENUM('admin', 'staff', 'customer'),
      allowNull: false,
      defaultValue: 'customer',
      comment: '用户角色'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '是否活跃'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最后登录时间'
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  }
);

export default User;







