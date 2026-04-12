import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase"
import { ROUTES } from "../../const/const"
import { useAuth } from "../../auth/useAuth"
import styles from "./Auth.module.css"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            navigate(ROUTES.INVENTORY)
        }
    }, [user, navigate])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate(ROUTES.INVENTORY)
        } catch (err: any) {
            setError("メールアドレスまたはパスワードが正しくありません。")
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className={styles.page}>
            <section className={styles.card}>
                <p className={styles.brand}>Inventory App</p>
                <h1 className={styles.title}>ログイン</h1>
                <p className={styles.description}>
                    在庫管理と販売分析を利用するために、アカウントにログインしてください。
                </p>

                <form className={styles.form} onSubmit={handleLogin}>
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

                    {error && <p className={styles.error}>{error}</p>}

                    <button className={styles.button} type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "ログイン中..." : "ログイン"}
                    </button>
                </form>

                <div className={styles.footer}>
                    アカウントをお持ちでない方は
                    <button
                        type="button"
                        className={styles.linkButton}
                        onClick={() => navigate(ROUTES.SIGNUP)}
                    >
                        新規登録
                    </button>
                </div>
            </section>
        </main>
    )
}