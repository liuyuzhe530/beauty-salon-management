import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

export interface ProductAttributes {
  id?: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  cost: number;
  stock: number;
  sold?: number;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product extends Model<ProductAttributes> implements ProductAttributes {
  declare id: string;
  declare name: string;
  declare category: string;
  declare description: string | null;
  declare price: number;
  declare cost: number;
  declare stock: number;
  declare sold: number;
  declare image: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: '产品名称'
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '分类'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '描述'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '售价'
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '成本'
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '库存'
    },
    sold: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '已售'
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '图片'
    }
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    underscored: true
  }
);

export default Product;







