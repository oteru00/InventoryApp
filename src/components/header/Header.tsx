import styles from "./Header.module.css";
import HeaderLogo from "./components/HeaderLogo";
import HeaderNav from "./components/HeaderNav";
import HeaderSearch from "./components/HeaderSearch";
import AddProductButton from "./components/AddProductButton";

type HeaderProps = {
    onClickAddProduct: () => void;
    searchValue?: string;
    onChangeSearch?: (value: string) => void;
};

export default function Header({
    onClickAddProduct,
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
            </div>
        </header>
    );
}
