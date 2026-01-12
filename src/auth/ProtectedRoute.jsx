import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { PageLoader } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()
    const location = useLocation()

    // If Supabase is not configured, bypass auth (for development)
    if (!supabase) {
        return children
    }

    if (loading) {
        return <PageLoader message="Authenticating..." />
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}
