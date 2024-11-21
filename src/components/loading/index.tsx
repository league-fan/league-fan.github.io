import styles from "./styles.module.scss";

export default function LoadingSkeleton() {
  return (
    <div className={styles.preloader}>
      <div>
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
