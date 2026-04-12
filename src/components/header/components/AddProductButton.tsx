import styles from "../Header.module.css";
import { TEXTS } from "../../../const/texts";

type AddProductButtonProps = {
    onClick: () => void;
};

export default function AddProductButton({ onClick }: AddProductButtonProps) {
    return (
        <button className={styles.addProduct} onClick={onClick}>
            {TEXTS.NAV_ADD_PRODUCT}
        </button>
    );
}
