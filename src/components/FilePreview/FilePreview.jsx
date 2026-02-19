import React from 'react'
import styles from './FilePreview.module.css'

const CodePreviewComponent = ({ code }) => {
  return (
    <div className={styles.preview}>
      <pre>
        <code className={styles.code}>{code}</code>
      </pre>
    </div>
  )
}

export default CodePreviewComponent
