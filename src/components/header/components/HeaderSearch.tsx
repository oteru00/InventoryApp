import styles from "../Header.module.css";
import { TEXTS } from "../../../const/texts";

type HeaderSearchProps = {
    value: string;
    onChange?: (value: string) => void;
};

export default function HeaderSearch({ value, onChange }: HeaderSearchProps) {
    return (
        <input
            className={styles.search}
            type="text"
            placeholder={TEXTS.NAV_SEARCH_PLACEHOLDER}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
        />
    );
}
