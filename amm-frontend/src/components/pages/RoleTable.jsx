import { Badge, Button } from "../ui";

export default function RoleTable({ roles, onEdit, onDelete, loading, isSuperAdmin }) {
    if (loading) {
        return (
            <div className="bg-neutral-800 rounded-lg p-6">
                <p className="text-white text-center">Loading roles...</p>
            </div>
        );
    }

    if (roles.length === 0) {
        return (
            <div className="bg-neutral-800 rounded-lg p-6">
                <p className="text-gray-400 text-center py-8">No roles found</p>
            </div>
        );
    }

    return (
        <div className="fg-neutral-800 rounded-lg p-6 overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Emote</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Description</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Permissions</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-white">Status</th>
                        {isSuperAdmin && (
                            <th className="px-4 py-3 text-right text-sm font-semibold text-white">Actions</th>
                        )}
                    </tr>
                </thead>
                
                <tbody className="divide-y divide-neutral-700">
                    {roles.map((role) => (
                        <tr key={role._id} className="hover:bg-neutral-700/50 transition text-white">
                            <td className="px-4 py-3">{role.icon}</td>
                            <td className="px-4 py-3">
                                <div>
                                    <p className="font-medium">{role.displayName}</p>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                                {role.description}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                    {role.permissions?.slice(0, 3).map((perm, idx) => (
                                        <span 
                                            key={idx}
                                            className="text-xs px-2 py-1 bg-neutral-700 rounded text-gray-300"
                                        >
                                            {perm.replace(/_/g, ' ')}
                                        </span>
                                    ))}
                                    {role.permissions?.length > 3 && (
                                        <span className="text-xs px-2 py-1 bg-neutral-700 rounded text-gray-300">
                                            +{role.permissions.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <Badge variant={role.isActive ? "success" : "danger"}>
                                    {role.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </td>
                            {isSuperAdmin && (
                                <td className="px-4 py-3 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => onEdit(role)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => onDelete(role)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            )}   
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
}
