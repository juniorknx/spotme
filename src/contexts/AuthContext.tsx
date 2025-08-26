// context/AuthContext.tsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import {
    onAuthStateChanged,
    signOut,
    User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebaseConfig';

type SpotMeUser = FirebaseUser & {
    displayName: string;
    age: number;
    photoURL: string;
    isActive: boolean;
    isPremium: boolean;
    premiumUntil: string | null;
    placeId: string;
    placeName: string;
    lastSeenAt: any;
    createdAt: any;
    updatedAt: any;
    // Pode adicionar outros campos conforme `users/{uid}/profile/main`
    gender?: string;
    interests?: string[];
    description?: string;
    phone?: string;
};

interface AuthContextProps {
    user: SpotMeUser | null;
    loading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    loading: true,
    logout: () => { },
});

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<SpotMeUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const token = await firebaseUser.getIdToken();
                localStorage.setItem('token', token);

                // Busca do subdocumento profile/main
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                const userData = userDoc.exists() ? userDoc.data() : {};

                setUser({
                    ...firebaseUser,
                    ...userData,
                } as SpotMeUser);
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
