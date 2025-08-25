import { toast } from "react-hot-toast"
import { SignUpFormData } from "@/types";

export function validateStep(
    step: number,
    formData: SignUpFormData,
    birthdate: string,
    selected: string | null,
    photos: { file: File; preview: string }[]
): boolean {
    if (step === 1) {
        if (!formData.name.trim() || !formData.phone.trim() || !birthdate.trim() || !selected) {
            toast.error("Preencha todos os campos antes de continuar.")
            return false
        }
    }

    if (step === 2) {
        if (photos.length === 0) {
            toast.error("Envie ao menos uma foto.")
            return false
        }
    }

    if (step === 3) {
        if (
            !formData.email.trim() ||
            !formData.password.trim() ||
            !formData.confirmPassword.trim()
        ) {
            toast.error("Preencha todos os campos corretamente.")
            return false
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("As senhas não coincidem.")
            return false
        }
    }

    return true
}
