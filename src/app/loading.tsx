import styles from './loading.module.scss'
import clsx from 'clsx'

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="min-h-screen min-w-screen w-full h-full flex justify-center items-center">
      <div className={clsx(styles['ellipse-content'])}>
        <div className={clsx(styles['loading-spinner'])}></div>
      </div>
    </div>
  )
}
