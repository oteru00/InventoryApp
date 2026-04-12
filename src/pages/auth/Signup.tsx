import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { auth, db } from "../../firebase"
import { ROUTES } from "../../const/const"
import { useAuth } from "../../auth/useAuth"
import styles from "./Auth.module.css"

export default function Signup() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            navigate(ROUTES.INVENTORY)
        }
    }, [user, navigate])

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password.length < 6) {
            setError("パスワードは6文字以上で入力してください。")
            return
        }

        if (password !== passwordConfirm) {
            setError("パスワード確認が一致していません。")
            return
        }

        setIsSubmitting(true)

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const createdUser = userCredential.user

            await setDoc(doc(db, "users", createdUser.uid), {
                uid: createdUser.uid,
                email: createdUser.email,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })

            navigate(ROUTES.INVENTORY)
        } catch (err: any) {
            setError("新規登録に失敗しました。入力内容をご確認ください。")
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className={styles.page}>
            <section className={styles.card}>
                <p className={styles.brand}>Inventory App</p>
                <h1 className={styles.title}>新規登録</h1>
                <p className={styles.description}>
                    アカウントを作成すると、ユーザーごとに在庫データを管理できます。
                </p>

                <form className={styles.form} onSubmit={handleSignup}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="email">
                            メールアドレス
                        </label>
                        <input
                            id="email"
                            className={styles.input}
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="password">
                            パスワード
                        </label>
                        <input
                            id="password"
                            className={styles.input}
                            type="password"
                            placeholder="6文字以上で入力"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="passwordConfirm">
                            パスワード確認
                        </label>
                        <input
                            id="passwordConfirm"
                            className={styles.input}
                            type="password"
                            placeholder="もう一度入力"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button className={styles.button} type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "登録中..." : "登録する"}
                    </button>
                </form>

                <div className={styles.footer}>
                    すでにアカウントをお持ちの方は
                    <button
                        type="button"
                        className={styles.linkButton}
                        onClick={() => navigate(ROUTES.LOGIN)}
                    >
                        ログイン
                    </button>
                </div>
            </section>
        </main>
    )
}