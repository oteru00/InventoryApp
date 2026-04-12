import styles from "../Header.module.css";

type Props = {
    onClick: () => void
}

export default function LogoutButton({ onClick }: Props) {
    return (
        <button className={styles.logoutButton} onClick={onClick}>
            ログアウト
        </button>
    )
}
