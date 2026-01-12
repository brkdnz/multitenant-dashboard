import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, Users, Save, Search, UserPlus } from 'lucide-react'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { Roles, hasRoleAccess, assignUserRole } from '@/lib/rbac'
import { logAction, AuditActions } from '@/lib/auditLog'
import { getAllWidgets } from '@/widgets/registry'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/Toast'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

/**
 * Role labels for display
 */
const roleLabels = {
    [Roles.ADMIN]: { label: 'Admin', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    [Roles.MANAGER]: { label: 'Manager', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
    [Roles.USER]: { label: 'User', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    [Roles.GUEST]: { label: 'Guest', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
}

/**
 * RBAC Settings Component
 * Manage role-based widget visibility and assign roles to users
 */
export default function RBACSettings() {
    const { t } = useTranslation()
    const tenant = useTenant()
    const { updateConfig, rbac } = useTenantContext()
    const toast = useToast()

    const [activeTab, setActiveTab] = useState('permissions') // 'permissions' | 'users'

    // User Management State
    const [targetEmail, setTargetEmail] = useState('')
    const [targetRole, setTargetRole] = useState(Roles.USER)
    const [isAssigning, setIsAssigning] = useState(false)
    const [tenantUsers, setTenantUsers] = useState([])
    const [isLoadingUsers, setIsLoadingUsers] = useState(false)

    // Widget permissions state
    const [widgetPermissions, setWidgetPermissions] = useState(() => {
        return tenant?.rbac?.widgetPermissions || {}
    })

    const allWidgets = getAllWidgets()

    // Fetch users with roles for this tenant
    const fetchTenantUsers = useCallback(async () => {
        if (!tenant?.id) return
        setIsLoadingUsers(true)
        try {
            // Try to use the view first
            const { data, error } = await supabase
                .from('tenant_users_view')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.warn('View fetch failed, falling back to table', error)
                // Fallback to basic table if view doesn't exist yet
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('user_roles')
                    .select('*')
                    .eq('tenant_id', tenant.id)

                if (fallbackError) throw fallbackError
                setTenantUsers(fallbackData || [])
            } else {
                setTenantUsers(data || [])
            }
        } catch (error) {
            console.error('Error fetching users:', error)
            toast.error('Error', 'Failed to load user roles')
        } finally {
            setIsLoadingUsers(false)
        }
    }, [tenant?.id, toast])

    useEffect(() => {
        if (activeTab === 'users') {
            fetchTenantUsers()
        }
    }, [activeTab, fetchTenantUsers])

    const handleAssignRole = async (e) => {
        e.preventDefault()
        if (!targetEmail) return

        setIsAssigning(true)
        try {
            const input = targetEmail.trim()
            let userId = input

            // Determine if input is Email or UUID
            const isEmail = input.includes('@')

            if (isEmail) {
                // Call RPC function to get ID from Email
                const { data, error } = await supabase.rpc('get_user_id_by_email', { email_input: input })

                if (error || !data) {
                    throw new Error('User not found with this email (ensure they have signed up)')
                }
                userId = data
            } else if (!input.includes('-')) {
                throw new Error('Invalid ID format. Please use Email or UUID.')
            }

            await assignUserRole(userId, tenant.id, targetRole)

            toast.success('Role Assigned', `Role ${targetRole} assigned to user`)
            setTargetEmail('')
            fetchTenantUsers()

            logAction(AuditActions.RBAC_ROLE_CHANGE, {
                userId,
                role: targetRole,
            }, tenant.id)

        } catch (error) {
            toast.error('Assignment Failed', error.message)
        } finally {
            setIsAssigning(false)
        }
    }

    const handleWidgetPermissionChange = useCallback(async (widgetId, permissions) => {
        const previousPermissions = widgetPermissions[widgetId] || []
        const newPermissions = { ...widgetPermissions, [widgetId]: permissions }

        setWidgetPermissions(newPermissions)

        // Update tenant config
        await updateConfig({
            rbac: {
                ...tenant?.rbac,
                widgetPermissions: newPermissions,
            },
        })

        logAction(AuditActions.RBAC_WIDGET_PERMISSION, {
            widgetId,
            previousValue: previousPermissions,
            newValue: permissions,
            field: 'widgetPermissions',
        }, tenant?.id)
    }, [widgetPermissions, tenant, updateConfig])

    const toggleWidgetRole = useCallback((widgetId, role) => {
        const current = widgetPermissions[widgetId] || []
        let newPermissions
        if (current.includes(role)) {
            newPermissions = current.filter((r) => r !== role)
        } else {
            newPermissions = [...current, role]
        }
        handleWidgetPermissionChange(widgetId, newPermissions)
    }, [widgetPermissions, handleWidgetPermissionChange])

    if (!tenant) return null

    // Helper for rendering tables
    const renderUsersTab = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Assign Role</CardTitle>
                    <CardDescription>Grant permissions to a user by their Email or ID</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAssignRole} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label>User Email or UUID</Label>
                            <Input
                                placeholder="name@example.com or uuid..."
                                value={targetEmail}
                                onChange={e => setTargetEmail(e.target.value)}
                            />
                        </div>
                        <div className="w-[150px] space-y-2">
                            <Label>Role</Label>
                            <Select value={targetRole} onValueChange={setTargetRole}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(roleLabels).map(([role, { label }]) => (
                                        <SelectItem key={role} value={role}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" disabled={isAssigning}>
                            {isAssigning ? 'Assigning...' : 'Assign'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Existing Roles</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingUsers ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : tenantUsers.length === 0 ? (
                        <p className="text-center text-[hsl(var(--muted-foreground))]">No specific roles assigned.</p>
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] font-medium">
                                    <tr>
                                        <th className="p-3">User</th>
                                        <th className="p-3">Role</th>
                                        <th className="p-3">Assigned At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tenantUsers.map((ur) => (
                                        <tr key={ur.assignment_id || ur.id} className="border-t border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/50)]">
                                            <td className="p-3">
                                                <div className="font-medium">{ur.email || 'Unknown Email'}</div>
                                                <div className="text-xs text-[hsl(var(--muted-foreground))] font-mono">{ur.user_id}</div>
                                            </td>
                                            <td className="p-3">
                                                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', roleLabels[ur.role]?.color)}>
                                                    {roleLabels[ur.role]?.label || ur.role}
                                                </span>
                                            </td>
                                            <td className="p-3 text-[hsl(var(--muted-foreground))]">
                                                {new Date(ur.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )

    // Render Permissions Tab
    const renderPermissionsTab = () => (
        <div className="space-y-4">
            {allWidgets.map((widget) => {
                const permissions = widgetPermissions[widget.id] || []
                const isPublic = permissions.length === 0
                return (
                    <div
                        key={widget.id}
                        className={cn(
                            'rounded-[var(--radius)] border p-4 transition-all border-[hsl(var(--border))] bg-[hsl(var(--card))]'
                        )}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{widget.id}</span>
                                    {isPublic ? (
                                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            Public
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                                            Restricted
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                    {widget.category}
                                </p>
                            </div>
                        </div>
                        {/* Role toggles */}
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(roleLabels).map(([role, { label, color }]) => {
                                const isSelected = permissions.includes(role)
                                return (
                                    <button
                                        key={role}
                                        onClick={() => toggleWidgetRole(widget.id, role)}
                                        className={cn(
                                            'rounded-full px-3 py-1 text-xs font-medium transition-all',
                                            isSelected ? color : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'
                                        )}
                                    >
                                        {label}
                                        {isSelected && ' ✓'}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex gap-2 border-b pb-2">
                <Button
                    variant={activeTab === 'permissions' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('permissions')}
                    size="sm"
                >
                    <Shield className="mr-2 h-4 w-4" />
                    Widget Permissions
                </Button>
                <Button
                    variant={activeTab === 'users' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('users')}
                    size="sm"
                >
                    <Users className="mr-2 h-4 w-4" />
                    User Roles
                </Button>
            </div>

            {activeTab === 'permissions' ? renderPermissionsTab() : renderUsersTab()}
        </div>
    )
}
