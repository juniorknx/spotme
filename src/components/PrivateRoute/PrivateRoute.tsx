import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Spinner from '@/components/Spinner/index';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [loading, user]);

    if (loading || !user) return <Spinner fullScreen color="#5A007A" />;

    return <>{children}</>;
}
