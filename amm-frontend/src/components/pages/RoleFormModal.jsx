import { useState, useEffect } from "react";
import { Modal, Input, Button } from "../ui";

export default function RoleFormModal({ 
    isOpen, 
    onClose, 
    onSubmit, 
    initialData = null,
    availablePermissions = []
}) {
    const [formData, setFormData] = useState({
        name: '',
        displayName: '',
        description: '',
        icon: '👤',
        color: '#6B7280',
        permissions: [],
        isActive: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                displayName: '',
                description: '',
                icon: '👤',
                color: '#6B7280',
                permissions: [],
                isActive: true
            });
        }
    }, [initialData, isOpen]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePermissionToggle = (permission) => {
        setFormData(prev => {
            const permissions = prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission];
            return { ...prev, permissions };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const iconOptions = ['👤', '👑', '🔐', '📋', '🔧', '🔩', '⚡', '✈️', '✅', '🛠️'];
    const colorOptions = [
        { value: '#6B7280', label: 'Gray' },
        { value: '#EF4444', label: 'Red' },
        { value: '#F59E0B', label: 'Orange' },
        { value: '#10B981', label: 'Green' },
        { value: '#3B82F6', label: 'Blue' },
        { value: '#8B5CF6', label: 'Purple' },
        { value: '#EC4899', label: 'Pink' },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Edit Role" : "Create New Role"}
            size="large"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Role Name (Internal)"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., AIRCRAFT_ENGINEER"
                        helperText="Uppercase with underscores"
                    />

                    <Input
                        label="Display Name"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Aircraft Engineer"
                    />
                </div>

                <Input
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the role's responsibilities"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Icon Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Icon
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {iconOptions.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors
                                        ${formData.icon === icon 
                                            ? 'bg-blue-600 ring-2 ring-blue-400' 
                                            : 'bg-neutral-700 hover:bg-neutral-600'
                                        }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {colorOptions.map(({ value, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, color: value }))}
                                    className={`w-10 h-10 rounded-lg transition-all
                                        ${formData.color === value 
                                            ? 'ring-2 ring-white scale-110' 
                                            : 'hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: value }}
                                    title={label}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Active Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Status
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="w-5 h-5 rounded bg-neutral-700 border-gray-600"
                            />
                            <span className="text-sm text-gray-300">Active Role</span>
                        </label>
                    </div>
                </div>

                {/* Permissions */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        Permissions ({formData.permissions.length} selected)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-3 bg-neutral-700/30 rounded-lg">
                        {availablePermissions.map(({ value, label }) => (
                            <label
                                key={value}
                                className="flex items-center gap-2 p-2 rounded hover:bg-neutral-700/50 cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.permissions.includes(value)}
                                    onChange={() => handlePermissionToggle(value)}
                                    className="w-4 h-4 rounded bg-neutral-600 border-gray-500"
                                />
                                <span className="text-sm text-gray-300">{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                    >
                        {initialData ? "Update Role" : "Create Role"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
