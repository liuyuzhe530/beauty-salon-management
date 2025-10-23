"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(model) {
        this.model = model;
    }
    async findAll(options) {
        return (await this.model.findAll(options));
    }
    async findById(id) {
        return (await this.model.findByPk(id));
    }
    async findOne(options) {
        return (await this.model.findOne(options));
    }
    async create(data) {
        return (await this.model.create(data));
    }
    async update(id, data) {
        const [affectedCount, affectedRows] = await this.model.update(data, {
            where: { id },
            returning: true,
        });
        return [affectedCount, (affectedRows || [])];
    }
    async delete(id) {
        return await this.model.destroy({
            where: { id },
        });
    }
}
exports.BaseService = BaseService;
exports.default = BaseService;
//# sourceMappingURL=baseService.js.map