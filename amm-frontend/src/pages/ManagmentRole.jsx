import { useState, useEffect } from 'react';
import { roleService, authService } from '../services';
import { PageHeader, Button, StatCard, Modal } from '../components/ui';
import { RoleTable, RoleFormModal } from '../components/pages';

function RoleManagement() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, role: null });
    
    const user = authService.getUser() || {};
    const isSuperAdmin = user.role === 'SUPER_ADMIN';

    const availablePermissions = [
        { value: 'VIEW_DASHBOARD', label: 'View Dashboard' },
        { value: 'MANAGE_AIRCRAFT', label: 'Manage Aircraft' },
        { value: 'MANAGE_MPD', label: 'Manage MPD' },
        { value: 'CREATE_MPL', label: 'Create MPL' },
        { value: 'EDIT_MPL', label: 'Edit MPL' },
        { value: 'SEND_MPL_TO_MRO', label: 'Send MPL to MRO' },
        { value: 'CREATE_MPTL', label: 'Create MPTL' },
        { value: 'EDIT_MPTL', label: 'Edit MPTL' },
        { value: 'ASSIGN_TASKS', label: 'Assign Tasks' },
        { value: 'VIEW_TASKS', label: 'View Tasks' },
        { value: 'UPDATE_TASK_STATUS', label: 'Update Task Status' },
        { value: 'ADD_WORK_LOG', label: 'Add Work Log' },
        { value: 'ISSUE_CRS', label: 'Issue CRS' },
        { value: 'MANAGE_SERVICE_BULLETINS', label: 'Manage Service Bulletins' },
        { value: 'MANAGE_USERS', label: 'Manage Users' },
        { value: 'MANAGE_ROLES', label: 'Manage Roles' },
        { value: 'VIEW_REPORTS', label: 'View Reports' }
    ];

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const data = await roleService.getAllRoles();
            setRoles(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching roles:', error);
            alert('Failed to load roles');
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingRole) {
                await roleService.updateRole(editingRole._id, formData);
                alert('Role updated successfully!');
            } else {
                await roleService.createRole(formData);
                alert('Role created successfully!');
            }
            
            setShowModal(false);
            setEditingRole(null);
            fetchRoles();
        } catch (error) {
            console.error('Error saving role:', error);
            alert(`Failed to save role: ${error.message}`);
        }
    };

    const handleEdit = (role) => {
        setEditingRole(role);
        setShowModal(true);
    };

    const handleDeleteClick = (role) => {
        setDeleteModal({ show: true, role });
    };

    const handleConfirmDelete = async () => {
        try {
            await roleService.deleteRole(deleteModal.role._id);
            setRoles(roles.filter(r => r._id !== deleteModal.role._id));
            setDeleteModal({ show: false, role: null });
            alert('Role Deleted !');
        } catch (error) {
            console.error('Error deleting role:', error);
            alert(`Error: ${error.message || 'Failed to Delete Role'}`);
        }
    };

    if (!isSuperAdmin) {
        return (
            <div className="p-6">
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-white">
                    <h2 className="text-xl font-bold">Access Denied</h2>
                    <p className="text-gray-300 mt-2">Only Super Admins can manage roles.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-neutral-900 min-h-screen">
            <PageHeader 
                title="Role Management"
                subtitle="Manage System Roles and Permissions"
            >
                <Button
                    variant="primary"
                    onClick={() => {
                        setEditingRole(null);
                        setShowModal(true);
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Role
                </Button>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard 
                    title="Total Roles"
                    value={roles.length}
                    color="gray"
                />
                <StatCard 
                    title="System Roles"
                    value={roles.filter(r => r.isSystem).length}
                    color="blue"
                />
                <StatCard 
                    title="Custom Roles"
                    value={roles.filter(r => !r.isSystem).length}
                    color="green"
                />
                <StatCard 
                    title="Active Roles"
                    value={roles.filter(r => r.isActive).length}
                    color="purple"
                />
            </div>

            <RoleTable 
                roles={roles}
                loading={loading}
                isSuperAdmin={isSuperAdmin}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <RoleFormModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingRole(null);
                }}
                onSubmit={handleSubmit}
                initialData={editingRole}
                availablePermissions={availablePermissions}
            />

            <Modal
                isOpen={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, role: null })}
                title="Confirm Delete"
                maxWidth='max-w-xl'
            >
                <p className="text-gray-300 mb-6">
                    Are you sure you want to delete the role "{deleteModal.role?.displayName}"?
                </p>
                <div className="flex justify-end gap-4">
                    <Button
                        variant="secondary"
                        onClick={() => setDeleteModal({ show: false, role: null })}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirmDelete}
                    >
                        Delete
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default RoleManagement;
