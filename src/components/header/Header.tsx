import styles from "./Header.module.css";
import HeaderLogo from "./components/HeaderLogo";
import HeaderNav from "./components/HeaderNav";
import HeaderSearch from "./components/HeaderSearch";
import AddProductButton from "./components/AddProductButton";
import LogoutButton from "./components/LogoutButton"; // ←追加

type HeaderProps = {
    onClickAddProduct: () => void;
    onLogout: () => void; // ←追加
    searchValue?: string;
    onChangeSearch?: (value: string) => void;
};

export default function Header({
    onClickAddProduct,
    onLogout,
    searchValue = "",
    onChangeSearch,
}: HeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.headerItems}>
                <HeaderLogo />
                <HeaderNav />
            </div>

            <div className={styles.headerItems}>
                <HeaderSearch value={searchValue} onChange={onChangeSearch} />
                <AddProductButton onClick={onClickAddProduct} />
                <LogoutButton onClick={onLogout} /> {/* ←追加 */}
            </div>
        </header>
    );
}