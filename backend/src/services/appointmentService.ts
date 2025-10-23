import { Op } from 'sequelize';
import Appointment from '../database/models/Appointment';
import { BaseService } from './baseService';

export class AppointmentService extends BaseService<any> {
  constructor() {
    super(Appointment);
  }

  async findByCustomer(customerId: string) {
    return this.findAll({
      where: { customerId },
      order: [['appointmentDate', 'DESC']],
    });
  }

  async findByStaff(staffId: string) {
    return this.findAll({
      where: { staffId },
      order: [['appointmentDate', 'DESC']],
    });
  }

  async findUpcoming(days: number = 7) {
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return this.findAll({
      where: {
        appointmentDate: {
          [Op.between]: [now, future],
        },
        status: ['pending', 'confirmed'],
      },
      order: [['appointmentDate', 'ASC']],
    });
  }

  async getStats() {
    const total = await this.model.count();
    const confirmed = await this.model.count({ where: { status: 'confirmed' } });
    const completed = await this.model.count({ where: { status: 'completed' } });
    return { totalAppointments: total, confirmed, completed };
  }
}

export default new AppointmentService();




