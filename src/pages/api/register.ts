// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/services/firebaseConfig";
import axios from "axios";
import crypto from "crypto";

// 🔒 Dados sensíveis via .env
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

// Permite um body pequeno (já que agora só vêm textos/URLs)
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "2mb",
        },
    },
};

// ⬆️ Upload de imagem para o Cloudinary (LEGADO – mantido)
const uploadToCloudinary = async (base64: string) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
        .createHash("sha1")
        .update(`timestamp=${timestamp}${API_SECRET}`)
        .digest("hex");

    const formData = new URLSearchParams();
    formData.append("file", base64);
    formData.append("api_key", API_KEY);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return response.data.secure_url as string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método não permitido." });
    }

    const {
        name,
        email,
        password,
        confirmPassword,
        phone,
        birthdate,
        gender,
        interests,
        about,
        photos,
    } = req.body;

    if (
        !name ||
        !email ||
        !password ||
        !phone ||
        !birthdate ||
        !gender ||
        !interests ||
        !photos ||
        !Array.isArray(photos) ||
        photos.length === 0
    ) {
        return res.status(400).json({ message: "Dados obrigatórios não informados." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "As senhas não coincidem." });
    }

    try {
        // --- SUPORTE A DOIS MODOS ---
        let uploadedPhotos: string[] = [];

        // NOVO: se vier string[], já são URLs do Cloudinary
        if (typeof photos[0] === "string") {
            uploadedPhotos = photos as string[];
        } else {
            // LEGADO: se vierem objetos { preview: base64 }, faz upload aqui
            uploadedPhotos = await Promise.all(
                (photos as Array<{ preview: string }>).map(async (photo) => {
                    return await uploadToCloudinary(photo.preview);
                })
            );
        }

        const mainPhoto = uploadedPhotos[0];

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: name,
            email,
            phone,
            birthdate,
            gender,
            interests,
            about: about || "",
            photoURL: mainPhoto,
            gallery: uploadedPhotos,
            isActive: true,
            isPremium: false,
            premiumUntil: null,
            placeId: null,
            placeName: null,
            lastSeenAt: serverTimestamp(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return res.status(201).json({ message: "Usuário criado com sucesso." });
    } catch (error: any) {
        console.error("Erro ao criar usuário:", error);
        return res.status(500).json({ message: error.message || "Erro interno no servidor." });
    }
}
