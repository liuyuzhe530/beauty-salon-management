import { SystemData } from './enhancedAIService';

/**
 * 数据收集服务 - 从系统各模块收集数据供 AI 分析
 */
class DataCollectorService {
  /**
   * 收集所有系统数据
   */
  async collectAllData(): Promise<SystemData> {
    try {
      const [customerData, appointmentData, staffData, salesData, marketingData] = await Promise.all([
        this.collectCustomerData(),
        this.collectAppointmentData(),
        this.collectStaffData(),
        this.collectSalesData(),
        this.collectMarketingData(),
      ]);

      return {
        customers: customerData,
        appointments: appointmentData,
        staff: staffData,
        sales: salesData,
        marketing: marketingData,
      };
    } catch (error) {
      console.error('数据收集错误:', error);
      return {};
    }
  }

  /**
   * 收集客户数据
   */
  private async collectCustomerData() {
    try {
      // 从 localStorage 获取客户数据（演示模式）
      const customersStr = localStorage.getItem('customers');
      const customers = customersStr ? JSON.parse(customersStr) : [];

      if (!customers || customers.length === 0) {
        return {
          total: 0,
          newThisMonth: 0,
          churnRate: 0,
          activeCustomers: 0,
          vipCustomers: 0,
          highRiskCustomers: [],
        };
      }

      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      // 统计新增客户
      const newThisMonth = customers.filter((c: any) => {
        const createdDate = new Date(c.createdAt || c.dateJoined);
        return createdDate > monthAgo;
      }).length;

      // 统计 VIP 客户
      const vipCustomers = customers.filter((c: any) => c.membershipLevel === 'VIP' || c.type === 'VIP').length;

      // 识别高风险客户（30 天未预约）
      const appointmentsStr = localStorage.getItem('appointments');
      const appointments = appointmentsStr ? JSON.parse(appointmentsStr) : [];

      const highRiskCustomers = customers
        .map((customer: any) => {
          const lastAppointment = appointments
            .filter((a: any) => a.customerId === customer.id || a.customerName === customer.name)
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

          const lastAppointmentDate = lastAppointment ? new Date(lastAppointment.date) : sixtyDaysAgo;
          const daysSinceLastAppointment = Math.floor(
            (now.getTime() - lastAppointmentDate.getTime()) / (24 * 60 * 60 * 1000)
          );

          return {
            id: customer.id,
            name: customer.name,
            daysSinceLastAppointment,
            totalSpent: customer.totalSpent || 0,
          };
        })
        .filter((c: any) => c.daysSinceLastAppointment >= 30)
        .sort((a: any, b: any) => b.daysSinceLastAppointment - a.daysSinceLastAppointment)
        .slice(0, 10);

      // 估算流失率（60 天未预约的客户数 / 总客户数）
      const churnedCustomers = customers.filter((customer: any) => {
        const lastAppointment = appointments
          .filter((a: any) => a.customerId === customer.id || a.customerName === customer.name)
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        const lastAppointmentDate = lastAppointment ? new Date(lastAppointment.date) : sixtyDaysAgo;
        const daysSinceLastAppointment = Math.floor(
          (now.getTime() - lastAppointmentDate.getTime()) / (24 * 60 * 60 * 1000)
        );

        return daysSinceLastAppointment >= 60;
      }).length;

      const churnRate = customers.length > 0 ? Math.round((churnedCustomers / customers.length) * 100) : 0;

      return {
        total: customers.length,
        newThisMonth,
        churnRate,
        activeCustomers: Math.max(0, customers.length - churnedCustomers),
        vipCustomers,
        highRiskCustomers,
      };
    } catch (error) {
      console.error('客户数据收集错误:', error);
      return {
        total: 0,
        newThisMonth: 0,
        churnRate: 0,
        activeCustomers: 0,
        vipCustomers: 0,
        highRiskCustomers: [],
      };
    }
  }

  /**
   * 收集预约数据
   */
  private async collectAppointmentData() {
    try {
      const appointmentsStr = localStorage.getItem('appointments');
      const appointments = appointmentsStr ? JSON.parse(appointmentsStr) : [];

      if (!appointments || appointments.length === 0) {
        return {
          totalThisMonth: 0,
          confirmationRate: 0,
          peakHours: [],
          averageDuration: 0,
          noShowRate: 0,
        };
      }

      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // 统计本月预约
      const thisMonthAppointments = appointments.filter((a: any) => {
        const appointmentDate = new Date(a.date);
        return appointmentDate > monthAgo;
      });

      // 统计确认率
      const confirmedAppointments = thisMonthAppointments.filter(
        (a: any) => a.status === 'Confirmed' || a.status === 'confirmed'
      ).length;
      const confirmationRate = thisMonthAppointments.length > 0 
        ? Math.round((confirmedAppointments / thisMonthAppointments.length) * 100)
        : 0;

      // 识别高峰时段
      const hourCounts: { [key: string]: number } = {};
      thisMonthAppointments.forEach((a: any) => {
        const date = new Date(a.date);
        const hour = `${date.getHours()}:00`;
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      const peakHours = Object.entries(hourCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([hour]) => hour);

      // 计算平均预约时长
      const durations = thisMonthAppointments
        .map((a: any) => a.duration || 60)
        .filter((d: number) => d > 0);
      const averageDuration = durations.length > 0
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        : 60;

      // 统计爽约率
      const noShowAppointments = thisMonthAppointments.filter(
        (a: any) => a.status === 'NoShow' || a.status === 'no-show'
      ).length;
      const noShowRate = thisMonthAppointments.length > 0
        ? Math.round((noShowAppointments / thisMonthAppointments.length) * 100)
        : 0;

      return {
        totalThisMonth: thisMonthAppointments.length,
        confirmationRate,
        peakHours,
        averageDuration,
        noShowRate,
      };
    } catch (error) {
      console.error('预约数据收集错误:', error);
      return {
        totalThisMonth: 0,
        confirmationRate: 0,
        peakHours: [],
        averageDuration: 0,
        noShowRate: 0,
      };
    }
  }

  /**
   * 收集员工数据
   */
  private async collectStaffData() {
    try {
      const staffStr = localStorage.getItem('staff');
      const staffList = staffStr ? JSON.parse(staffStr) : [];

      if (!staffList || staffList.length === 0) {
        return {
          total: 0,
          activeStaff: 0,
          performanceRanking: [],
        };
      }

      const appointmentsStr = localStorage.getItem('appointments');
      const appointments = appointmentsStr ? JSON.parse(appointmentsStr) : [];

      // 计算每个员工的表现
      const performanceRanking = staffList
        .map((staff: any) => {
          const staffAppointments = appointments.filter(
            (a: any) => a.staffId === staff.id || a.staffName === staff.name
          );

          const completedAppointments = staffAppointments.filter(
            (a: any) => a.status === 'Completed' || a.status === 'completed'
          ).length;

          const confirmedAppointments = staffAppointments.filter(
            (a: any) => a.status === 'Confirmed' || a.status === 'confirmed'
          ).length;

          const confirmationRate = staffAppointments.length > 0
            ? Math.round((confirmedAppointments / staffAppointments.length) * 100)
            : 0;

          return {
            name: staff.name,
            appointmentsCompleted: completedAppointments,
            confirmationRate,
            customerSatisfaction: staff.rating || 85,
          };
        })
        .sort((a, b) => b.appointmentsCompleted - a.appointmentsCompleted);

      return {
        total: staffList.length,
        activeStaff: staffList.filter((s: any) => s.isActive !== false).length,
        performanceRanking,
      };
    } catch (error) {
      console.error('员工数据收集错误:', error);
      return {
        total: 0,
        activeStaff: 0,
        performanceRanking: [],
      };
    }
  }

  /**
   * 收集销售数据
   */
  private async collectSalesData() {
    try {
      const productsStr = localStorage.getItem('products');
      const products = productsStr ? JSON.parse(productsStr) : [];

      if (!products || products.length === 0) {
        return {
          totalRevenue: 0,
          revenueThisMonth: 0,
          topProducts: [],
          growth: 0,
        };
      }

      // 计算销售数据
      const topProducts = products
        .map((p: any) => ({
          name: p.name,
          sales: p.soldCount || Math.floor(Math.random() * 50),
          revenue: (p.price || 0) * (p.soldCount || Math.floor(Math.random() * 50)),
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const totalRevenue = topProducts.reduce((sum, p) => sum + p.revenue, 0);
      const revenueThisMonth = Math.round(totalRevenue * 0.3); // 假设本月占 30%

      return {
        totalRevenue: Math.round(totalRevenue),
        revenueThisMonth,
        topProducts,
        growth: Math.floor(Math.random() * 15) + 5, // 模拟 5-20% 增长
      };
    } catch (error) {
      console.error('销售数据收集错误:', error);
      return {
        totalRevenue: 0,
        revenueThisMonth: 0,
        topProducts: [],
        growth: 0,
      };
    }
  }

  /**
   * 收集营销数据
   */
  private async collectMarketingData() {
    try {
      // 从 localStorage 获取营销活动数据
      const activitiesStr = localStorage.getItem('marketingActivities');
      const activities = activitiesStr ? JSON.parse(activitiesStr) : [];

      if (!activities || activities.length === 0) {
        // 返回模拟数据
        return {
          activeActivities: [
            {
              name: '社交媒体推广',
              cost: 2000,
              roi: 250,
              conversions: 15,
            },
            {
              name: '新客体验优惠',
              cost: 3000,
              roi: 180,
              conversions: 22,
            },
          ],
        };
      }

      const activeActivities = activities
        .filter((a: any) => a.status === 'Active' || a.status === 'active')
        .slice(0, 5);

      return {
        activeActivities,
      };
    } catch (error) {
      console.error('营销数据收集错误:', error);
      return {
        activeActivities: [],
      };
    }
  }

  /**
   * 生成数据摘要报告
   */
  async generateDataSummaryReport(): Promise<string> {
    const data = await this.collectAllData();

    const report = `
【系统数据摘要报告】

1. 客户概览
   总客户: ${data.customers?.total} | 新增: ${data.customers?.newThisMonth} | 流失率: ${data.customers?.churnRate}%
   高风险客户: ${data.customers?.highRiskCustomers?.length} 位

2. 预约概览
   本月预约: ${data.appointments?.totalThisMonth} | 确认率: ${data.appointments?.confirmationRate}% | 爽约率: ${data.appointments?.noShowRate}%
   高峰时段: ${data.appointments?.peakHours?.join('、') || '无'}

3. 员工概览
   总数: ${data.staff?.total} | 在职: ${data.staff?.activeStaff}
   表现最好: ${data.staff?.performanceRanking?.[0]?.name} (${data.staff?.performanceRanking?.[0]?.appointmentsCompleted} 次预约)

4. 销售概览
   总收入: ¥${data.sales?.totalRevenue} | 本月: ¥${data.sales?.revenueThisMonth} | 增长率: ${data.sales?.growth}%

5. 营销概览
   活跃活动: ${data.marketing?.activeActivities?.length} 个
`;

    return report;
  }
}

// 导出单例实例
export const dataCollectorService = new DataCollectorService();
export default dataCollectorService;
