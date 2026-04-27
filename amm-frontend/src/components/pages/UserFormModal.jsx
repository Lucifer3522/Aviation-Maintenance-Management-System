import { useState, useEffect } from "react";
import { Modal, Input, Select, Button } from "../ui";

export default function UserFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'MRO',
        organization: '',
        licenseNumber: '',
        certifications: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                username: initialData.username || '',
                email: initialData.email || '',
                password: '',
                role: initialData.role || 'MRO',
                organization: initialData.organization || '',
                licenseNumber: initialData.licenseNumber || '',
                certifications: Array.isArray(initialData.certifications) ? initialData.certifications.join(', ') : (initialData.certifications || '')
            });
        } else {
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'MRO',
                organization: '',
                licenseNumber: '',
                certifications: ''
            });
        }
    }, [initialData, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const creating = !initialData;
        if (!formData.username || !formData.email || (creating && !formData.password)) {
            alert('Username, email, and password are required for new users');
            return;
        }

        const payload = {
            ...formData,
            certifications: formData.certifications 
                ? formData.certifications.split(',').map(c => c.trim()).filter(Boolean)
                : []
        };

        if (initialData && !payload.password) {
            delete payload.password;
        }

        onSubmit(payload);
    };

    const roleOptions = [
        { value: 'SUPER_ADMIN', label: 'Super Admin' },
        { value: 'ADMIN', label: 'Admin' },
        { value: 'CAMO', label: 'CAMO' },
        { value: 'MRO', label: 'MRO' },
        { value: 'B1_TECH', label: 'B1 Technician' },
        { value: 'B2_TECH', label: 'B2 Technician' },
        { value: 'C_TECH', label: 'C Technician' },
        { value: 'CRS', label: 'CRS' }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Edit User" : "Create New User"}
            maxWidth="max-w-4xl"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter username"
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="user@example.com"
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter password"
                    />

                    <Select
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        options={roleOptions}
                        required
                    />

                    <Input
                        label="Organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        placeholder="Organization name"
                    />

                    <Input
                        label="License Number"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        placeholder="For technicians"
                    />

                    <div className="md:col-span-2">
                        <Input
                            label="Certifications"
                            name="certifications"
                            value={formData.certifications}
                            onChange={handleInputChange}
                            placeholder="Comma-separated certifications"
                            helperText="Example: A320 Type Rating, EASA Part-66, etc."
                        />
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
                        {initialData ? "Update User" : "Create User"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
