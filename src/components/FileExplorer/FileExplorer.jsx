import React, { useState } from 'react'

import file from '../../assets/icons/file.png'
import styles from './FileExplorer.module.css'
import sharedStyles from '../../aicodegen.module.css'

const FileExplorerItem = ({ name, type, contents, path, setAbsolutePath }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  if (type === 'directory') {
    return (
      <div className={styles.directory}>
        <span onClick={handleToggle} className={sharedStyles.aiPointer}>
          {isExpanded ? '-' : '+'}{' '}
          <img
            width='20px'
            src='https://static-00.iconduck.com/assets.00/folder-icon-512x410-jvths5l6.png'
            alt=''
          />
          &nbsp;{name}
        </span>
        {isExpanded && (
          <div className={styles.contents}>
            {contents.map((item, index) => (
              <FileExplorerItem
                setAbsolutePath={setAbsolutePath}
                key={index}
                {...item}
              />
            ))}
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div
        role='button'
        onClick={() => {
          setAbsolutePath(path)
        }}
        className={styles.file}
      >
        <img width='25px' src={file} alt='' />
        {name}
      </div>
    )
  }
}

const FileExplorer = ({ files = [], setAbsolutePath }) => {
  return (
    <div className='file-explorer'>
      {files
        .sort((a, b) => {
          if (a.type === 'directory' && b.type !== 'directory') {
            return -1
          } else if (a.type !== 'directory' && b.type === 'directory') {
            return 1
          } else {
            return 0
          }
        })
        .map((item, index) => (
          <FileExplorerItem
            setAbsolutePath={setAbsolutePath}
            key={index}
            {...item}
          />
        ))}
    </div>
  )
}

export default FileExplorer
