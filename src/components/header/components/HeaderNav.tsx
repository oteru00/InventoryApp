import styles from "../Header.module.css";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../../const/const";
import { TEXTS } from "../../../const/texts";

const navClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.nav} ${styles.navActive}` : styles.nav;

export default function HeaderNav() {
    return (
        <nav className={styles.headerNav}>
            <NavLink to={ROUTES.INVENTORY} className={navClassName}>
                {TEXTS.NAV_INVENTORY}
            </NavLink>
            <NavLink to={ROUTES.ANALYTICS} className={navClassName}>
                {TEXTS.NAV_ANALYTICS}
            </NavLink>
        </nav>
    );
}
