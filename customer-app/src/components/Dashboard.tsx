import React from 'react';
import { TrendingUp, Users, Calendar, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCustomerStorage } from '../hooks/useCustomerStorage';
import { useAppointmentStorage } from '../hooks/useAppointmentStorage';
import { useStaffStorage } from '../hooks/useStaffStorage';
import { useProductStorage } from '../hooks/useProductStorage';

export const Dashboard: React.FC = () => {
  const { customers } = useCustomerStorage();
  const { appointments } = useAppointmentStorage();
  const { staff } = useStaffStorage();
  const { products } = useProductStorage();

  // 计算统计数据
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const atRiskCustomers = customers.filter(c => c.status === 'atrisk').length;
  const todayAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const activeStaff = staff.filter(s => s.status === 'active').length;
  const totalRevenue = appointments.reduce((sum, a) => sum + a.price, 0);
  const totalProductRevenue = products.reduce((sum, p) => sum + (p.price * p.sold), 0);
  const overallRevenue = totalRevenue + totalProductRevenue;
  const totalProductValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockProducts = products.filter(p => p.stock <= 20).length;

  // 获取排名前的美容师
  const topStaff = [...staff].sort((a, b) => b.rating - a.rating).slice(0, 3);
  
  // 获取最近的预约
  const recentAppointments = appointments.slice(-5).reverse();

  const metrics = [
    {
      label: '总营收',
      value: `¥${overallRevenue.toLocaleString()}`,
      change: `预约: ¥${totalRevenue.toLocaleString()}, 产品: ¥${totalProductRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: '确认预约',
      value: todayAppointments.toString(),
      change: `待确认: ${pendingAppointments}`,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      label: '活跃客户',
      value: activeCustomers.toString(),
      change: `风险客户: ${atRiskCustomers}`,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      label: '在职美容师',
      value: activeStaff.toString(),
      change: `总人数: ${staff.length}`,
      icon: Users,
      color: 'text-amber-600'
    },
    {
      label: '库存价值',
      value: `¥${totalProductValue.toLocaleString()}`,
      change: `产品数: ${products.length}`,
      icon: ShoppingBag,
      color: 'text-cyan-600'
    },
    {
      label: '库存预警',
      value: lowStockProducts.toString(),
      change: '需要补货的产品',
      icon: AlertCircle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-green-900">仪表盘</h1>
        <p className="text-green-600 mt-1">实时业务数据概览</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-white rounded-lg border border-green-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
                <Icon className={`w-5 h-5 ${metric.color} opacity-50`} />
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <p className="text-xs text-gray-500">{metric.change}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Staff */}
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">顶级美容师</h2>
          </div>
          <div className="space-y-3">
            {topStaff.length > 0 ? (
              topStaff.map((s, idx) => (
                <div key={s.id} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-500">{Array.isArray(s.specialty) ? s.specialty.join(', ') : s.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{s.rating}</p>
                    <p className="text-xs text-gray-500">{s.clientCount}客户</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">暂无美容师数据</p>
            )}
          </div>
        </div>

        {/* Risk Alert */}
        {atRiskCustomers > 0 && (
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-red-900">风险客户预警</h2>
            </div>
            <div className="space-y-3">
              {customers
                .filter(c => c.status === 'atrisk')
                .slice(0, 5)
                .map(customer => (
                  <div key={customer.id} className="flex items-center justify-between pb-3 border-b border-red-200 last:border-0">
                    <div>
                      <p className="font-medium text-red-900">{customer.name}</p>
                      <p className="text-xs text-red-600">最后访问: {customer.lastVisit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-900">¥{customer.totalSpending.toLocaleString()}</p>
                      <p className="text-xs text-red-600">{customer.appointmentCount}次预约</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recent Appointments */}
        <div className="md:col-span-2 bg-white rounded-lg border border-green-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">最近预约</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-green-200">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-600 pb-2">客户</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-2">美容师</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-2">服务</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-2">日期/时间</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-2">金额</th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-2">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentAppointments.length > 0 ? (
                  recentAppointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="py-3 text-sm text-gray-900">{apt.customerName}</td>
                      <td className="py-3 text-sm text-gray-600">{apt.staffName}</td>
                      <td className="py-3 text-sm text-gray-600">{apt.service}</td>
                      <td className="py-3 text-sm text-gray-600">{apt.date} {apt.time}</td>
                      <td className="py-3 text-sm font-medium text-gray-900">¥{apt.price.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {apt.status === 'confirmed' ? '已确认' :
                           apt.status === 'pending' ? '待确认' :
                           apt.status === 'completed' ? '已完成' :
                           '已取消'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-sm text-gray-500">
                      暂无预约数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Business Summary */}
        <div className="md:col-span-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">业务总结</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">客户总数</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                活跃: {activeCustomers}, 风险: {atRiskCustomers}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">预约总数</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                已确认: {todayAppointments}, 待确认: {pendingAppointments}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">业绩指标</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.length > 0 ? ((totalProductRevenue / (products.reduce((sum, p) => sum + (p.cost * p.stock), 0) || 1)) * 100).toFixed(0) : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">利润率</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
