import React, { useState } from 'react';
import { Save, RefreshCw, Bell, Shield, Database } from 'lucide-react';

const AdminConfig = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    backupFrequency: 'daily',
    maxLoginAttempts: 3,
    sessionTimeout: 30,
    maintenanceMode: false
  });

  const handleSave = () => {
    // Aquí implementarías la lógica para guardar la configuración
    alert('Configuración guardada');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Configuración del Sistema</h2>

      <div className="space-y-6">
        {/* Seguridad */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-blue-500" />
            <h3 className="text-xl font-semibold">Seguridad</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Intentos máximos de inicio de sesión
              </label>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({
                  ...settings,
                  maxLoginAttempts: parseInt(e.target.value)
                })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tiempo de sesión (minutos)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({
                  ...settings,
                  sessionTimeout: parseInt(e.target.value)
                })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="text-blue-500" />
            <h3 className="text-xl font-semibold">Notificaciones</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({
                  ...settings,
                  emailNotifications: e.target.checked
                })}
                className="mr-2"
              />
              <label>Activar notificaciones por correo</label>
            </div>
          </div>
        </div>

        {/* Backup */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Database className="text-blue-500" />
            <h3 className="text-xl font-semibold">Respaldo</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Frecuencia de respaldo
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => setSettings({
                  ...settings,
                  backupFrequency: e.target.value
                })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="hourly">Cada hora</option>
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mantenimiento */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="text-blue-500" />
            <h3 className="text-xl font-semibold">Mantenimiento</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({
                  ...settings,
                  maintenanceMode: e.target.checked
                })}
                className="mr-2"
              />
              <label>Modo mantenimiento</label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save size={20} />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminConfig;