import type React from "react"

type Props = {
    styles: Record<string, string>
    title: string
    onClose: () => void
    children: React.ReactNode
    footer: React.ReactNode
}

export default function DialogShell({ styles, title, onClose, children, footer }: Props) {
    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="close">
                        ×
                    </button>
                </div>

                <div className={styles.body}>{children}</div>
                <div className={styles.footer}>{footer}</div>
            </div>
        </div>
    )
}