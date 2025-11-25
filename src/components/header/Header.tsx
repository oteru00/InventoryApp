import styles from "./Header.module.css";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../const/const";

type HeaderProps = {
    onClickAddProduct: () => void;
};

export default function Header({ onClickAddProduct }: HeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.headerItems}>
                <h1 className={styles.logo}>Inventory</h1>
                <nav className={styles.headerNav}>
                    <NavLink to={ROUTES.INVENTORY} className={({ isActive }) =>
                        isActive
                            ? `${styles.nav} ${styles.navActive}`
                            : styles.nav
                    }>在庫管理
                    </NavLink>
                    <NavLink to={ROUTES.ANALYTICS} className={({ isActive }) =>
                        isActive
                            ? `${styles.nav} ${styles.navActive}`
                            : styles.nav
                    }>販売分析
                    </NavLink>
                    <NavLink to={ROUTES.SETTINGS} className={({ isActive }) =>
                        isActive
                            ? `${styles.nav} ${styles.navActive}`
                            : styles.nav
                    }>設定
                    </NavLink>
                </nav>
            </div>
            <div className={styles.headerItems}>
                <input
                    className={styles.search}
                    type="text"
                    placeholder="SKU / タイトル検索"
                />
                <button
                    className={styles.addProduct}
                    onClick={onClickAddProduct}
                >
                    ＋商品追加
                </button>
            </div>
        </header>
    );
}
