import { useState } from "react"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "../../../firebase"

type UseImageUploadOptions = {
    maxSizeMB?: number
    folder?: string
}

export function useImageUpload(options?: UseImageUploadOptions) {
    const maxSizeMB = options?.maxSizeMB ?? 10
    const folder = options?.folder ?? "inventory-images"

    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const upload = async (file: File) => {
        setError(null)

        //画像のサイズ制限
        if (file.size > maxSizeMB * 1024 * 1024) {
            const msg = `画像サイズが大きすぎます（${maxSizeMB}MBまで）`
            setError(msg)
            throw new Error(msg)
        }

        setUploading(true)
        try {
            const ext = file.name.split(".").pop() || "jpg"
            const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`
            const storageRef = ref(storage, `${folder}/${fileName}`)

            await uploadBytes(storageRef, file)
            const url = await getDownloadURL(storageRef)
            return url
        } catch (e) {
            console.error(e)
            const msg = "画像のアップロードに失敗しました"
            setError(msg)
            throw new Error(msg)
        } finally {
            setUploading(false)
        }
    }

    return { upload, uploading, error, setError }
}
