# 到店服务 vs 上门服务 - 完整拆分文档

##  概述

我们已经将美容服务完全拆分为两个独立的模块，每个模块有其自己的业务逻辑、数据模型和用户界面。

---

##  到店服务 (In-Store Service) - `InStoreService.tsx`

### 核心特点
```
场景：客户主动来店铺进行美容服务
主要流程：在线预约 → 店内报到 → 服务进行 → 评价反馈
地址管理：多店铺选择（朝阳店、海淀店、东城店、西城店）
```

### 数据模型
```typescript
interface InStoreAppointment {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  serviceType: string;           // 服务类型
  beautician: string;            // 美容师名字
  rating: number;                // 评分
  date: string;                  // 预约日期
  time: string;                  // 预约时间
  duration: number;              // 服务时长(分钟)
  price: number;                 // 价格
  status: 'pending' | 'confirmed' | 'checked-in' | 'in-service' | 'completed' | 'cancelled';
  notes: string;                 // 服务备注
  storeLocation: string;         // 店铺地址  关键字段
}
```

### 业务流程

```
1. 选择服务
   └─ 6类服务选择：按摩护肤、深层清洁、面部精油护理、祛痘护肤、眼部护理、全身SPA
   
2. 选择店铺  核心区别
   └─ 朝阳店、海淀店、东城店、西城店（4个物理位置）
   └─ 显示：地址、电话、营业面积
   
3. 选择时间
   └─ 日期选择
   └─ 时间选择
   
4. 选择美容师
   └─ 根据服务类型过滤
   └─ 显示美容师头像、评分、专业特长、可预约时段
   
5. 确认预约
   └─ 状态变为 'pending' (待确认)
   └─ 系统或管理员确认后变为 'confirmed'
   
6. 到店签到
   └─ 客户到达店铺时签到
   └─ 状态变为 'checked-in'
   
7. 服务进行
   └─ 状态变为 'in-service'
   
8. 完成服务
   └─ 状态变为 'completed'
   └─ 进入历史记录并可评价
```

### 关键功能

| 功能 | 说明 |
|------|------|
| **在线预约** | 选择服务、店铺、时间、美容师 |
| **我的预约** | 查看待进行预约，可标记完成或取消 |
| **历史记录** | 查看已完成服务，支持5星评价 |
| **美容师展示** | 查看所有驻店美容师的信息 |
| **店铺信息** | 展示各店铺的详细信息 |

### UI 配色
- **主色系**: 蓝色 (Building2 图标)
- **Tab 颜色**: 蓝色边框和文字

### 预约状态转换图
```
pending 
   ↓
confirmed 
   ↓ (客户到店)
checked-in 
   ↓
in-service 
   ↓
completed (可评价)

(任意状态可取消)
```

---

##  上门服务 (On-Site Service) - `OnSiteService.tsx`

### 核心特点
```
场景：美容师上门到用户家/办公地点
主要流程：在线预约 → 美容师接单 → 出发 → 到达签到 → 服务进行 → 评价反馈
地址管理：用户输入具体地址（实时追踪）
```

### 数据模型
```typescript
interface OnSiteOrder {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  address: string;               // 用户地址  关键字段
  serviceType: string;           // 服务类型
  beautician: string;            // 美容师名字
  rating: number;                // 评分
  date: string;                  // 预约日期
  time: string;                  // 预约时间
  duration: number;              // 服务时长(分钟)
  price: number;                 // 价格
  status: 'pending' | 'accepted' | 'en-route' | 'arrived' | 'in-service' | 'completed' | 'cancelled';
  notes: string;                 // 服务备注
  distance: number;              // 距离  关键字段
  estimatedArrival: number;      // 预计到达时间(分钟)  关键字段
}
```

### 业务流程

```
1. 选择服务
   └─ 同上
   
2. 输入服务地址  核心区别
   └─ 用户输入具体家庭或办公地址
   └─ GPS 定位
   
3. 选择时间
   └─ 日期选择
   └─ 时间选择
   
4. 选择美容师
   └─ 根据距离和可用性过滤
   └─ 显示距离、响应时间
   
5. 确认预约
   └─ 状态变为 'pending' (待美容师接单)
   
6. 美容师接单
   └─ 状态变为 'accepted'
   └─ 显示接单美容师信息
   
7. 美容师出发  实时追踪
   └─ 状态变为 'en-route'
   └─ 显示实时距离和到达倒计时
   
8. 美容师到达
   └─ 状态变为 'arrived'
   └─ 客户签到
   
9. 服务进行
   └─ 状态变为 'in-service'
   
10. 完成服务
    └─ 状态变为 'completed'
    └─ 进入历史记录并可评价
```

### 关键功能

| 功能 | 说明 |
|------|------|
| **立即预约** | 选择服务、输入地址、时间、美容师 |
| **进行中** | 查看进行中的订单，实时追踪美容师位置 |
| **订单历史** | 查看已完成订单，支持5星评价 |
| **美容师列表** | 查看可用美容师，显示距离和评分 |
| **位置追踪** | 实时显示美容师距离和到达倒计时 |

### UI 配色
- **主色系**: 粉色 (Home → MapPin 图标)
- **Tab 颜色**: 粉色边框和文字

### 预约状态转换图
```
pending 
   ↓ (美容师接单)
accepted 
   ↓ (美容师出发)
en-route (实时追踪 )
   ↓ (美容师到达)
arrived (签到确认)
   ↓
in-service 
   ↓
completed (可评价)

(任意状态可取消)
```

---

##  功能对比表

| 维度 | 到店服务 | 上门服务 |
|------|---------|--------|
| **场景** | 客户到店 | 美容师上门 |
| **地址类型** | 固定店铺地址 | 动态用户地址 |
| **店铺选择** | 4个固定选项 | 用户自由输入 |
| **距离追踪** |  无需 |  实时GPS追踪 |
| **预约流程** | 5步 | 7步 |
| **核心状态** | pending/confirmed/checked-in/in-service/completed | pending/accepted/en-route/arrived/in-service/completed |
| **美容师** | 店内驻店 | 上门服务 |
| **预约确认** | 系统/管理员确认 | 美容师主动接单 |
| **到达验证** | 店内签到 | GPS到达 + 签到 |
| **价格差异** | 基础价格 | 基础价格 + 上门费 |
| **主题颜色** | 蓝色 | 粉色 |
| **关键图标** | Building2 | MapPin |

---

##  组件结构

```
src/components/
├── CustomerManagement.tsx           总入口
│   ├── activeTab: 'customers' | 'appointments' | 'instore' | 'onsite' | 'operations'
│   ├─ 客户列表
│   ├─ 预约列表
│   ├─ 到店服务 Tab
│   │   └─ InStoreService.tsx       (到店服务独立组件)
│   ├─ 上门服务 Tab
│   │   └─ OnSiteService.tsx        (上门服务独立组件)
│   └─ 操作列表
│
├── InStoreService.tsx               到店服务
│   ├── 在线预约 (服务 → 店铺 → 时间 → 美容师)
│   ├── 我的预约 (查看、完成、取消)
│   ├── 历史记录 (已完成、评价)
│   └── 美容师列表
│
└── OnSiteService.tsx                上门服务
    ├── 立即预约 (服务 → 地址 → 时间 → 美容师)
    ├── 进行中 (实时追踪、位置显示)
    ├── 订单历史 (已完成、评价)
    └── 美容师列表 (距离、响应时间)
```

---

##  数据流

### 到店服务数据流
```
用户选择店铺和服务
    ↓
InStoreService 状态管理
    ↓
localStorage 存储 (useAppointmentStorage)
    ↓
UI 更新显示
```

### 上门服务数据流
```
用户输入地址和服务
    ↓
位置服务 (GPS/地图)
    ↓
OnSiteService 状态管理
    ↓
localStorage 存储
    ↓
实时位置追踪 (模拟)
    ↓
UI 更新显示
```

---

##  视觉区分

### 到店服务 (InStoreService)
```
Header 背景: 蓝色渐变 (from-blue-50 to-cyan-50)
Icon: Building2 (建筑物)
Border: border-blue-200
Text: text-blue-600
Button: from-blue-600 to-cyan-600
```

### 上门服务 (OnSiteService)
```
Header 背景: 粉色渐变 (from-pink-50 to-rose-50)
Icon: MapPin (地图定位)
Border: border-pink-200
Text: text-pink-600
Button: from-pink-600 to-rose-600
```

---

##  导航流程

### 用户访问路径

```
首页
 └─ 导航栏: 客户管理
     └─ CustomerManagement
         └─ Tab 标签页
             ├─ 客户列表 (Users)
             ├─ 预约列表 (Calendar)
             ├─ 到店服务 (Home) ← InStoreService
             ├─ 上门服务 (MapPin) ← OnSiteService
             └─ 操作列表 (CheckCircle)
```

---

##  存储策略

### 到店服务数据
```typescript
// 使用 appointments 数据结构
// 区分字段: storeLocation = "朝阳店" | "海淀店" | "东城店" | "西城店"
```

### 上门服务数据
```typescript
// 使用 appointments 数据结构
// 区分字段: address = "用户具体输入的地址"
```

---

##  实现要点

### 1. 完全独立的组件
-  InStoreService.tsx - 完全独立
-  OnSiteService.tsx - 完全独立
-  各自管理自己的状态

### 2. 独立的数据模型
- 到店服务: `InStoreAppointment` 接口
- 上门服务: `OnSiteOrder` 接口

### 3. 视觉完全区分
- 颜色不同 (蓝色 vs 粉色)
- 图标不同 (Building2 vs MapPin)
- Tab 标签独立

### 4. 业务逻辑独立
- 到店: 店铺选择逻辑
- 上门: 地址输入 + GPS追踪逻辑

### 5. 状态转换不同
- 到店: pending → confirmed → checked-in → ...
- 上门: pending → accepted → en-route → arrived → ...

---

##  未来扩展

### 到店服务可扩展项
- [ ] 店铺工作时间管理
- [ ] 店铺美容师排班表
- [ ] 走店间转移支持
- [ ] 店铺评价统计

### 上门服务可扩展项
- [ ] 真实 GPS 集成 (高德地图/百度地图)
- [ ] 美容师实时位置分享
- [ ] 用户端实时追踪界面
- [ ] 美容师工作范围限制
- [ ] 上门费动态计算

---

##  验证清单

-  InStoreService.tsx 创建完成
-  OnSiteService.tsx 创建完成
-  CustomerManagement.tsx 更新完成
-  两个 Tab 标签完全独立
-  颜色和图标区分清晰
-  业务流程完全不同
-  数据模型独立设计

---

##  总结

**到店服务** 和 **上门服务** 现在是完全独立的两个功能模块：

1. **UI 独立**: 各自的组件，各自的界面
2. **逻辑独立**: 各自的业务流程
3. **数据独立**: 各自的数据结构
4. **视觉独立**: 完全不同的颜色和图标
5. **导航独立**: 在客户管理中的两个独立 Tab

用户可以清晰地选择使用到店服务还是上门服务，每种服务都有完整的预约、追踪、评价流程。

##  概述

我们已经将美容服务完全拆分为两个独立的模块，每个模块有其自己的业务逻辑、数据模型和用户界面。

---

##  到店服务 (In-Store Service) - `InStoreService.tsx`

### 核心特点
```
场景：客户主动来店铺进行美容服务
主要流程：在线预约 → 店内报到 → 服务进行 → 评价反馈
地址管理：多店铺选择（朝阳店、海淀店、东城店、西城店）
```

### 数据模型
```typescript
interface InStoreAppointment {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  serviceType: string;           // 服务类型
  beautician: string;            // 美容师名字
  rating: number;                // 评分
  date: string;                  // 预约日期
  time: string;                  // 预约时间
  duration: number;              // 服务时长(分钟)
  price: number;                 // 价格
  status: 'pending' | 'confirmed' | 'checked-in' | 'in-service' | 'completed' | 'cancelled';
  notes: string;                 // 服务备注
  storeLocation: string;         // 店铺地址  关键字段
}
```

### 业务流程

```
1. 选择服务
   └─ 6类服务选择：按摩护肤、深层清洁、面部精油护理、祛痘护肤、眼部护理、全身SPA
   
2. 选择店铺  核心区别
   └─ 朝阳店、海淀店、东城店、西城店（4个物理位置）
   └─ 显示：地址、电话、营业面积
   
3. 选择时间
   └─ 日期选择
   └─ 时间选择
   
4. 选择美容师
   └─ 根据服务类型过滤
   └─ 显示美容师头像、评分、专业特长、可预约时段
   
5. 确认预约
   └─ 状态变为 'pending' (待确认)
   └─ 系统或管理员确认后变为 'confirmed'
   
6. 到店签到
   └─ 客户到达店铺时签到
   └─ 状态变为 'checked-in'
   
7. 服务进行
   └─ 状态变为 'in-service'
   
8. 完成服务
   └─ 状态变为 'completed'
   └─ 进入历史记录并可评价
```

### 关键功能

| 功能 | 说明 |
|------|------|
| **在线预约** | 选择服务、店铺、时间、美容师 |
| **我的预约** | 查看待进行预约，可标记完成或取消 |
| **历史记录** | 查看已完成服务，支持5星评价 |
| **美容师展示** | 查看所有驻店美容师的信息 |
| **店铺信息** | 展示各店铺的详细信息 |

### UI 配色
- **主色系**: 蓝色 (Building2 图标)
- **Tab 颜色**: 蓝色边框和文字

### 预约状态转换图
```
pending 
   ↓
confirmed 
   ↓ (客户到店)
checked-in 
   ↓
in-service 
   ↓
completed (可评价)

(任意状态可取消)
```

---

##  上门服务 (On-Site Service) - `OnSiteService.tsx`

### 核心特点
```
场景：美容师上门到用户家/办公地点
主要流程：在线预约 → 美容师接单 → 出发 → 到达签到 → 服务进行 → 评价反馈
地址管理：用户输入具体地址（实时追踪）
```

### 数据模型
```typescript
interface OnSiteOrder {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  address: string;               // 用户地址  关键字段
  serviceType: string;           // 服务类型
  beautician: string;            // 美容师名字
  rating: number;                // 评分
  date: string;                  // 预约日期
  time: string;                  // 预约时间
  duration: number;              // 服务时长(分钟)
  price: number;                 // 价格
  status: 'pending' | 'accepted' | 'en-route' | 'arrived' | 'in-service' | 'completed' | 'cancelled';
  notes: string;                 // 服务备注
  distance: number;              // 距离  关键字段
  estimatedArrival: number;      // 预计到达时间(分钟)  关键字段
}
```

### 业务流程

```
1. 选择服务
   └─ 同上
   
2. 输入服务地址  核心区别
   └─ 用户输入具体家庭或办公地址
   └─ GPS 定位
   
3. 选择时间
   └─ 日期选择
   └─ 时间选择
   
4. 选择美容师
   └─ 根据距离和可用性过滤
   └─ 显示距离、响应时间
   
5. 确认预约
   └─ 状态变为 'pending' (待美容师接单)
   
6. 美容师接单
   └─ 状态变为 'accepted'
   └─ 显示接单美容师信息
   
7. 美容师出发  实时追踪
   └─ 状态变为 'en-route'
   └─ 显示实时距离和到达倒计时
   
8. 美容师到达
   └─ 状态变为 'arrived'
   └─ 客户签到
   
9. 服务进行
   └─ 状态变为 'in-service'
   
10. 完成服务
    └─ 状态变为 'completed'
    └─ 进入历史记录并可评价
```

### 关键功能

| 功能 | 说明 |
|------|------|
| **立即预约** | 选择服务、输入地址、时间、美容师 |
| **进行中** | 查看进行中的订单，实时追踪美容师位置 |
| **订单历史** | 查看已完成订单，支持5星评价 |
| **美容师列表** | 查看可用美容师，显示距离和评分 |
| **位置追踪** | 实时显示美容师距离和到达倒计时 |

### UI 配色
- **主色系**: 粉色 (Home → MapPin 图标)
- **Tab 颜色**: 粉色边框和文字

### 预约状态转换图
```
pending 
   ↓ (美容师接单)
accepted 
   ↓ (美容师出发)
en-route (实时追踪 )
   ↓ (美容师到达)
arrived (签到确认)
   ↓
in-service 
   ↓
completed (可评价)

(任意状态可取消)
```

---

##  功能对比表

| 维度 | 到店服务 | 上门服务 |
|------|---------|--------|
| **场景** | 客户到店 | 美容师上门 |
| **地址类型** | 固定店铺地址 | 动态用户地址 |
| **店铺选择** | 4个固定选项 | 用户自由输入 |
| **距离追踪** |  无需 |  实时GPS追踪 |
| **预约流程** | 5步 | 7步 |
| **核心状态** | pending/confirmed/checked-in/in-service/completed | pending/accepted/en-route/arrived/in-service/completed |
| **美容师** | 店内驻店 | 上门服务 |
| **预约确认** | 系统/管理员确认 | 美容师主动接单 |
| **到达验证** | 店内签到 | GPS到达 + 签到 |
| **价格差异** | 基础价格 | 基础价格 + 上门费 |
| **主题颜色** | 蓝色 | 粉色 |
| **关键图标** | Building2 | MapPin |

---

##  组件结构

```
src/components/
├── CustomerManagement.tsx           总入口
│   ├── activeTab: 'customers' | 'appointments' | 'instore' | 'onsite' | 'operations'
│   ├─ 客户列表
│   ├─ 预约列表
│   ├─ 到店服务 Tab
│   │   └─ InStoreService.tsx       (到店服务独立组件)
│   ├─ 上门服务 Tab
│   │   └─ OnSiteService.tsx        (上门服务独立组件)
│   └─ 操作列表
│
├── InStoreService.tsx               到店服务
│   ├── 在线预约 (服务 → 店铺 → 时间 → 美容师)
│   ├── 我的预约 (查看、完成、取消)
│   ├── 历史记录 (已完成、评价)
│   └── 美容师列表
│
└── OnSiteService.tsx                上门服务
    ├── 立即预约 (服务 → 地址 → 时间 → 美容师)
    ├── 进行中 (实时追踪、位置显示)
    ├── 订单历史 (已完成、评价)
    └── 美容师列表 (距离、响应时间)
```

---

##  数据流

### 到店服务数据流
```
用户选择店铺和服务
    ↓
InStoreService 状态管理
    ↓
localStorage 存储 (useAppointmentStorage)
    ↓
UI 更新显示
```

### 上门服务数据流
```
用户输入地址和服务
    ↓
位置服务 (GPS/地图)
    ↓
OnSiteService 状态管理
    ↓
localStorage 存储
    ↓
实时位置追踪 (模拟)
    ↓
UI 更新显示
```

---

##  视觉区分

### 到店服务 (InStoreService)
```
Header 背景: 蓝色渐变 (from-blue-50 to-cyan-50)
Icon: Building2 (建筑物)
Border: border-blue-200
Text: text-blue-600
Button: from-blue-600 to-cyan-600
```

### 上门服务 (OnSiteService)
```
Header 背景: 粉色渐变 (from-pink-50 to-rose-50)
Icon: MapPin (地图定位)
Border: border-pink-200
Text: text-pink-600
Button: from-pink-600 to-rose-600
```

---

##  导航流程

### 用户访问路径

```
首页
 └─ 导航栏: 客户管理
     └─ CustomerManagement
         └─ Tab 标签页
             ├─ 客户列表 (Users)
             ├─ 预约列表 (Calendar)
             ├─ 到店服务 (Home) ← InStoreService
             ├─ 上门服务 (MapPin) ← OnSiteService
             └─ 操作列表 (CheckCircle)
```

---

##  存储策略

### 到店服务数据
```typescript
// 使用 appointments 数据结构
// 区分字段: storeLocation = "朝阳店" | "海淀店" | "东城店" | "西城店"
```

### 上门服务数据
```typescript
// 使用 appointments 数据结构
// 区分字段: address = "用户具体输入的地址"
```

---

##  实现要点

### 1. 完全独立的组件
-  InStoreService.tsx - 完全独立
-  OnSiteService.tsx - 完全独立
-  各自管理自己的状态

### 2. 独立的数据模型
- 到店服务: `InStoreAppointment` 接口
- 上门服务: `OnSiteOrder` 接口

### 3. 视觉完全区分
- 颜色不同 (蓝色 vs 粉色)
- 图标不同 (Building2 vs MapPin)
- Tab 标签独立

### 4. 业务逻辑独立
- 到店: 店铺选择逻辑
- 上门: 地址输入 + GPS追踪逻辑

### 5. 状态转换不同
- 到店: pending → confirmed → checked-in → ...
- 上门: pending → accepted → en-route → arrived → ...

---

##  未来扩展

### 到店服务可扩展项
- [ ] 店铺工作时间管理
- [ ] 店铺美容师排班表
- [ ] 走店间转移支持
- [ ] 店铺评价统计

### 上门服务可扩展项
- [ ] 真实 GPS 集成 (高德地图/百度地图)
- [ ] 美容师实时位置分享
- [ ] 用户端实时追踪界面
- [ ] 美容师工作范围限制
- [ ] 上门费动态计算

---

##  验证清单

-  InStoreService.tsx 创建完成
-  OnSiteService.tsx 创建完成
-  CustomerManagement.tsx 更新完成
-  两个 Tab 标签完全独立
-  颜色和图标区分清晰
-  业务流程完全不同
-  数据模型独立设计

---

##  总结

**到店服务** 和 **上门服务** 现在是完全独立的两个功能模块：

1. **UI 独立**: 各自的组件，各自的界面
2. **逻辑独立**: 各自的业务流程
3. **数据独立**: 各自的数据结构
4. **视觉独立**: 完全不同的颜色和图标
5. **导航独立**: 在客户管理中的两个独立 Tab

用户可以清晰地选择使用到店服务还是上门服务，每种服务都有完整的预约、追踪、评价流程。

##  概述

我们已经将美容服务完全拆分为两个独立的模块，每个模块有其自己的业务逻辑、数据模型和用户界面。

---

##  到店服务 (In-Store Service) - `InStoreService.tsx`

### 核心特点
```
场景：客户主动来店铺进行美容服务
主要流程：在线预约 → 店内报到 → 服务进行 → 评价反馈
地址管理：多店铺选择（朝阳店、海淀店、东城店、西城店）
```

### 数据模型
```typescript
interface InStoreAppointment {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  serviceType: string;           // 服务类型
  beautician: string;            // 美容师名字
  rating: number;                // 评分
  date: string;                  // 预约日期
  time: string;                  // 预约时间
  duration: number;              // 服务时长(分钟)
  price: number;                 // 价格
  status: 'pending' | 'confirmed' | 'checked-in' | 'in-service' | 'completed' | 'cancelled';
  notes: string;                 // 服务备注
  storeLocation: string;         // 店铺地址  关键字段
}
```

### 业务流程

```
1. 选择服务
   └─ 6类服务选择：按摩护肤、深层清洁、面部精油护理、祛痘护肤、眼部护理、全身SPA
   
2. 选择店铺  核心区别
   └─ 朝阳店、海淀店、东城店、西城店（4个物理位置）
   └─ 显示：地址、电话、营业面积
   
3. 选择时间
   └─ 日期选择
   └─ 时间选择
   
4. 选择美容师
   └─ 根据服务类型过滤
   └─ 显示美容师头像、评分、专业特长、可预约时段
   
5. 确认预约
   └─ 状态变为 'pending' (待确认)
   └─ 系统或管理员确认后变为 'confirmed'
   
6. 到店签到
   └─ 客户到达店铺时签到
   └─ 状态变为 'checked-in'
   
7. 服务进行
   └─ 状态变为 'in-service'
   
8. 完成服务
   └─ 状态变为 'completed'
   └─ 进入历史记录并可评价
```

### 关键功能

| 功能 | 说明 |
|------|------|
| **在线预约** | 选择服务、店铺、时间、美容师 |
| **我的预约** | 查看待进行预约，可标记完成或取消 |
| **历史记录** | 查看已完成服务，支持5星评价 |
| **美容师展示** | 查看所有驻店美容师的信息 |
| **店铺信息** | 展示各店铺的详细信息 |

### UI 配色
- **主色系**: 蓝色 (Building2 图标)
- **Tab 颜色**: 蓝色边框和文字

### 预约状态转换图
```
pending 
   ↓
confirmed 
   ↓ (客户到店)
checked-in 
   ↓
in-service 
   ↓
completed (可评价)

(任意状态可取消)
```

---

##  上门服务 (On-Site Service) - `OnSiteService.tsx`

### 核心特点
```
场景：美容师上门到用户家/办公地点
主要流程：在线预约 → 美容师接单 → 出发 → 到达签到 → 服务进行 → 评价反馈
地址管理：用户输入具体地址（实时追踪）
```

### 数据模型
```typescript
interface OnSiteOrder {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  address: string;               // 用户地址  关键字段
  serviceType: string;           // 服务类型
  beautician: string;            // 美容师名字
  rating: number;                // 评分
  date: string;                  // 预约日期
  time: string;                  // 预约时间
  duration: number;              // 服务时长(分钟)
  price: number;                 // 价格
  status: 'pending' | 'accepted' | 'en-route' | 'arrived' | 'in-service' | 'completed' | 'cancelled';
  notes: string;                 // 服务备注
  distance: number;              // 距离  关键字段
  estimatedArrival: number;      // 预计到达时间(分钟)  关键字段
}
```

### 业务流程

```
1. 选择服务
   └─ 同上
   
2. 输入服务地址  核心区别
   └─ 用户输入具体家庭或办公地址
   └─ GPS 定位
   
3. 选择时间
   └─ 日期选择
   └─ 时间选择
   
4. 选择美容师
   └─ 根据距离和可用性过滤
   └─ 显示距离、响应时间
   
5. 确认预约
   └─ 状态变为 'pending' (待美容师接单)
   
6. 美容师接单
   └─ 状态变为 'accepted'
   └─ 显示接单美容师信息
   
7. 美容师出发  实时追踪
   └─ 状态变为 'en-route'
   └─ 显示实时距离和到达倒计时
   
8. 美容师到达
   └─ 状态变为 'arrived'
   └─ 客户签到
   
9. 服务进行
   └─ 状态变为 'in-service'
   
10. 完成服务
    └─ 状态变为 'completed'
    └─ 进入历史记录并可评价
```

### 关键功能

| 功能 | 说明 |
|------|------|
| **立即预约** | 选择服务、输入地址、时间、美容师 |
| **进行中** | 查看进行中的订单，实时追踪美容师位置 |
| **订单历史** | 查看已完成订单，支持5星评价 |
| **美容师列表** | 查看可用美容师，显示距离和评分 |
| **位置追踪** | 实时显示美容师距离和到达倒计时 |

### UI 配色
- **主色系**: 粉色 (Home → MapPin 图标)
- **Tab 颜色**: 粉色边框和文字

### 预约状态转换图
```
pending 
   ↓ (美容师接单)
accepted 
   ↓ (美容师出发)
en-route (实时追踪 )
   ↓ (美容师到达)
arrived (签到确认)
   ↓
in-service 
   ↓
completed (可评价)

(任意状态可取消)
```

---

##  功能对比表

| 维度 | 到店服务 | 上门服务 |
|------|---------|--------|
| **场景** | 客户到店 | 美容师上门 |
| **地址类型** | 固定店铺地址 | 动态用户地址 |
| **店铺选择** | 4个固定选项 | 用户自由输入 |
| **距离追踪** |  无需 |  实时GPS追踪 |
| **预约流程** | 5步 | 7步 |
| **核心状态** | pending/confirmed/checked-in/in-service/completed | pending/accepted/en-route/arrived/in-service/completed |
| **美容师** | 店内驻店 | 上门服务 |
| **预约确认** | 系统/管理员确认 | 美容师主动接单 |
| **到达验证** | 店内签到 | GPS到达 + 签到 |
| **价格差异** | 基础价格 | 基础价格 + 上门费 |
| **主题颜色** | 蓝色 | 粉色 |
| **关键图标** | Building2 | MapPin |

---

##  组件结构

```
src/components/
├── CustomerManagement.tsx           总入口
│   ├── activeTab: 'customers' | 'appointments' | 'instore' | 'onsite' | 'operations'
│   ├─ 客户列表
│   ├─ 预约列表
│   ├─ 到店服务 Tab
│   │   └─ InStoreService.tsx       (到店服务独立组件)
│   ├─ 上门服务 Tab
│   │   └─ OnSiteService.tsx        (上门服务独立组件)
│   └─ 操作列表
│
├── InStoreService.tsx               到店服务
│   ├── 在线预约 (服务 → 店铺 → 时间 → 美容师)
│   ├── 我的预约 (查看、完成、取消)
│   ├── 历史记录 (已完成、评价)
│   └── 美容师列表
│
└── OnSiteService.tsx                上门服务
    ├── 立即预约 (服务 → 地址 → 时间 → 美容师)
    ├── 进行中 (实时追踪、位置显示)
    ├── 订单历史 (已完成、评价)
    └── 美容师列表 (距离、响应时间)
```

---

##  数据流

### 到店服务数据流
```
用户选择店铺和服务
    ↓
InStoreService 状态管理
    ↓
localStorage 存储 (useAppointmentStorage)
    ↓
UI 更新显示
```

### 上门服务数据流
```
用户输入地址和服务
    ↓
位置服务 (GPS/地图)
    ↓
OnSiteService 状态管理
    ↓
localStorage 存储
    ↓
实时位置追踪 (模拟)
    ↓
UI 更新显示
```

---

##  视觉区分

### 到店服务 (InStoreService)
```
Header 背景: 蓝色渐变 (from-blue-50 to-cyan-50)
Icon: Building2 (建筑物)
Border: border-blue-200
Text: text-blue-600
Button: from-blue-600 to-cyan-600
```

### 上门服务 (OnSiteService)
```
Header 背景: 粉色渐变 (from-pink-50 to-rose-50)
Icon: MapPin (地图定位)
Border: border-pink-200
Text: text-pink-600
Button: from-pink-600 to-rose-600
```

---

##  导航流程

### 用户访问路径

```
首页
 └─ 导航栏: 客户管理
     └─ CustomerManagement
         └─ Tab 标签页
             ├─ 客户列表 (Users)
             ├─ 预约列表 (Calendar)
             ├─ 到店服务 (Home) ← InStoreService
             ├─ 上门服务 (MapPin) ← OnSiteService
             └─ 操作列表 (CheckCircle)
```

---

##  存储策略

### 到店服务数据
```typescript
// 使用 appointments 数据结构
// 区分字段: storeLocation = "朝阳店" | "海淀店" | "东城店" | "西城店"
```

### 上门服务数据
```typescript
// 使用 appointments 数据结构
// 区分字段: address = "用户具体输入的地址"
```

---

##  实现要点

### 1. 完全独立的组件
-  InStoreService.tsx - 完全独立
-  OnSiteService.tsx - 完全独立
-  各自管理自己的状态

### 2. 独立的数据模型
- 到店服务: `InStoreAppointment` 接口
- 上门服务: `OnSiteOrder` 接口

### 3. 视觉完全区分
- 颜色不同 (蓝色 vs 粉色)
- 图标不同 (Building2 vs MapPin)
- Tab 标签独立

### 4. 业务逻辑独立
- 到店: 店铺选择逻辑
- 上门: 地址输入 + GPS追踪逻辑

### 5. 状态转换不同
- 到店: pending → confirmed → checked-in → ...
- 上门: pending → accepted → en-route → arrived → ...

---

##  未来扩展

### 到店服务可扩展项
- [ ] 店铺工作时间管理
- [ ] 店铺美容师排班表
- [ ] 走店间转移支持
- [ ] 店铺评价统计

### 上门服务可扩展项
- [ ] 真实 GPS 集成 (高德地图/百度地图)
- [ ] 美容师实时位置分享
- [ ] 用户端实时追踪界面
- [ ] 美容师工作范围限制
- [ ] 上门费动态计算

---

##  验证清单

-  InStoreService.tsx 创建完成
-  OnSiteService.tsx 创建完成
-  CustomerManagement.tsx 更新完成
-  两个 Tab 标签完全独立
-  颜色和图标区分清晰
-  业务流程完全不同
-  数据模型独立设计

---

##  总结

**到店服务** 和 **上门服务** 现在是完全独立的两个功能模块：

1. **UI 独立**: 各自的组件，各自的界面
2. **逻辑独立**: 各自的业务流程
3. **数据独立**: 各自的数据结构
4. **视觉独立**: 完全不同的颜色和图标
5. **导航独立**: 在客户管理中的两个独立 Tab

用户可以清晰地选择使用到店服务还是上门服务，每种服务都有完整的预约、追踪、评价流程。






