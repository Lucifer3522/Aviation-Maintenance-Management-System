import { useState, useEffect } from 'react';
import { authService, userService } from '../services';
import { PageHeader, Button } from '../components/ui';
import { UserTable, UserFormModal } from '../components/pages';
import { StatCard } from '../components/ui';
import { GlassmorphismDashboard } from '../components/GlassmorphismCard';
import '../styles/glassmorphism.css';

function UserManagement() {    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users: ' + error.message);
            setLoading(false);
        }
    };

    // Unified save handler for create and edit
    const handleSaveUser = async (formData) => {
        try {
            if (editingUser) {
                // Check if password is being changed
                const { password, ...userData } = formData;
                
                // Update user data (excluding password)
                await userService.updateUser(editingUser._id, userData);
                
                // If password is provided, update it through the admin endpoint
                if (password && password.trim()) {
                    await userService.adminUpdatePassword(editingUser._id, {
                        newPassword: password,
                        confirmPassword: password
                    });
                    alert('User updated and password changed successfully!');
                } else {
                    alert('User updated successfully!');
                }
            } else {
                // Create new user through auth service
                await authService.userRegister(formData);
                alert('User created successfully!');
            }

            setShowCreateModal(false);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error(editingUser ? 'Error updating user:' : 'Error creating user:', error);
            alert(`Failed to ${editingUser ? 'update' : 'create'} user: ${error.message}`);
        }
    };

    const handleEditUser = async (userId) => {
        try {
            const data = await userService.getUser(userId);
            const initial = {
                ...data,
                certifications: Array.isArray(data.certifications) ? data.certifications.join(', ') : (data.certifications || '')
            };
            setEditingUser(initial);
            setShowCreateModal(true);
        } catch (error) {
            console.error('Error loading user for edit:', error);
            alert('Failed to load user details: ' + error.message);
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
            return;
        }

        try {
            await userService.deleteUser(userId);
            alert('User deleted successfully!');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(`Failed to delete user: ${error.message}`);
        }
    };

    const totalUsers = users.length;
    const camoUsers = users.filter(u => u.role === 'CAMO').length;
    const mroUsers = users.filter(u => u.role === 'MRO').length;
    const technicianUsers = users.filter(u => 
        ['B1_TECH', 'B2_TECH', 'C_TECH'].includes(u.role)
    ).length;

    return (
        <GlassmorphismDashboard>
            <PageHeader 
                title="User Management"
                subtitle="Manage System Users"
            >
                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        onClick={() => { setEditingUser(null); setShowCreateModal(true); }}
                        className='flex-end'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Create User
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard 
                    title="Total Users"
                    value={totalUsers}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                    }
                    color="blue"
                />
                
                <StatCard 
                    title="CAMO"
                    value={camoUsers}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                    }
                    color="green"
                />
                
                <StatCard 
                    title="MRO"
                    value={mroUsers}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                        </svg>
                    }
                    color="purple"
                />
                
                <StatCard 
                    title="Technicians"
                    value={technicianUsers}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
                        </svg>
                    }
                    color="yellow"
                />
            </div>

            <UserTable 
                users={users}
                loading={loading}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
            />

            <UserFormModal
                isOpen={showCreateModal}
                onClose={() => { setShowCreateModal(false); setEditingUser(null); }}
                onSubmit={handleSaveUser}
                initialData={editingUser}
            />
        </GlassmorphismDashboard>
    );
}

export default UserManagement;
