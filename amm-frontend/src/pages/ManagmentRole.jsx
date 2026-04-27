import { useState, useEffect } from 'react';
import { roleService, authService } from '../services';
import { PageHeader, Button, StatCard, Modal } from '../components/ui';
import { RoleTable, RoleFormModal } from '../components/pages';
import { GlassmorphismDashboard } from '../components/GlassmorphismCard';
import '../styles/glassmorphism.css';

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
        <GlassmorphismDashboard>
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
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                    }
                    color="blue"
                />
                
                <StatCard 
                    title="System Roles"
                    value={roles.filter(r => r.isSystem).length}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                    }
                    color="green"
                />
                
                <StatCard 
                    title="Custom Roles"
                    value={roles.filter(r => !r.isSystem).length}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                        </svg>
                    }
                    color="purple"
                />
                
                <StatCard 
                    title="Active Roles"
                    value={roles.filter(r => r.isActive).length}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
                        </svg>
                    }
                    color="yellow"
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
        </GlassmorphismDashboard>
    );
}

export default RoleManagement;
