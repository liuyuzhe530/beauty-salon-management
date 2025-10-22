import React from 'react';
import { Store, Users, User } from 'lucide-react';
import { UserRole } from '../types/index';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  const roles = [
    {
      id: 'admin',
      name: '管理员',
      description: '完整的美容院管理权限',
      icon: Store,
      color: 'from-green-600 to-green-500'
    },
    {
      id: 'staff',
      name: '美容师',
      description: '日程、客户和业绩管理',
      icon: Users,
      color: 'from-green-500 to-green-400'
    },
    {
      id: 'customer',
      name: '客户',
      description: '预约、商城和个人中心',
      icon: User,
      color: 'from-green-400 to-green-300'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-900 mb-3">
            美容院管理系�?          </h1>
          <p className="text-lg text-green-700">
            一台手机掌控整个美容院的管理系�?          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map(role => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => onSelectRole(role.id as UserRole)}
                className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Card content */}
                <div className="relative bg-white p-8 rounded-xl border-2 border-green-200 group-hover:border-transparent transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-lg mb-4 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-8 h-8 text-green-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300">
                      {role.name}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-green-100 transition-colors duration-300">
                      {role.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-300 to-transparent group-hover:via-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-green-700">
            淡绿色高端设�?| 完全响应�?| 无Emoji风格
          </p>
        </div>
      </div>
    </div>
  );
};
