import styles from "./AnalyticsPage.module.css"
import { TEXTS } from "../../const/texts"

export default function AnalyticsPage() {
  return (
    <h2 className={styles.title}>{TEXTS.ANALYTICS_TITLE}</h2>
  )
}
