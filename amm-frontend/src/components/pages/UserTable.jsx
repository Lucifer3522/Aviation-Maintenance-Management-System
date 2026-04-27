import { Badge, Button } from "../ui";

export default function UserTable({ users, onEditUser, onDeleteUser, loading }) {
    const getRoleBadgeVariant = (role) => {
        switch(role) {
            case 'SUPER_ADMIN': return 'danger';
            case 'ADMIN': return 'primary';
            case 'CAMO': return 'info';
            case 'MRO': return 'warning';
            case 'B1_TECH':
            case 'B2_TECH':
            case 'C_TECH': return 'success';
            case 'CRS': return 'secondary';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <div className="bg-neutral-800 rounded-lg p-6">
                <p className="text-white text-center">Loading users...</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="bg-neutral-800 rounded-lg p-6">
                <p className="text-gray-400 text-center py-8">No users found</p>
            </div>
        );
    }

    return (
        <div className="bg-neutral-800 rounded-lg p-6 overflow-x-auto">
            <table className="w-full">
                <thead className="bg-neutral-700">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">User</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Organization</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">License</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Created</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-white">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700">
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-neutral-700/50 transition text-white">
                            <td className="px-4 py-3">
                                <div>
                                    <p className="font-medium">{user.username}</p>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <Badge variant={getRoleBadgeVariant(user.role)}>
                                    {user.role}
                                </Badge>
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                                {user.organization || '-'}
                            </td>
                            <td className="px-4 py-3">
                                <span className="font-mono text-sm text-gray-300">
                                    {user.licenseNumber || '-'}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right flex gap-2 justify-end">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => onEditUser(user._id)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => onDeleteUser(user._id, user.username)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
