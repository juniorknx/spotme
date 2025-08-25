import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebaseConfig';

type CustomUser = FirebaseUser & {
    about?: string;                  // "Software Engineer and Indie Hacker"
    birthdate?: string;              // "02/03/1994"
    createdAt?: any;                 // Timestamp
    displayName?: string;            // "Julio Junior" (pode vir também do FirebaseUser)
    email?: string;                  // "juliodev220@gmail.com" (tbm no FirebaseUser)
    gallery?: string[];              // array de URLs
    gender?: string;                 // "Masculino"
    interests?: string | string[];   // pode ser string no seu dado atual
    isActive?: boolean;              // true
    isPremium?: boolean;             // false
    lastSeenAt?: any;                // Timestamp
    phone?: string;                  // "(51) 99250-0741"
    photoURL?: string;               // URL
    placeId?: string | null;         // null
    placeName?: string | null;       // null
    premiumUntil?: any;              // Timestamp | null
    uid?: string;                    // já vem do FirebaseUser
    updatedAt?: any;                 // Timestamp
};

interface AuthContextProps {
    user: CustomUser | null;
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
    const [user, setUser] = useState<CustomUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    const token = await firebaseUser.getIdToken();
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('token', token);
                    }

                    const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
                    const userData = snap.exists() ? (snap.data() as Partial<CustomUser>) : {};

                    setUser({ ...firebaseUser, ...userData } as CustomUser);
                } else {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                    }
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
