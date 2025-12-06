import styles from "./setting.module.css"
import { TEXTS } from "../../const/texts";


export default function SettingsPage() {
  return (
    <h2 className={styles.title}>{TEXTS.SETTINGS_TITLE}</h2>
  )
}
