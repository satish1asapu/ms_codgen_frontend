import React, { useState } from 'react'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import styles from './Aicodegen.module.css'
import sharedStyles from '../../aicodegen.module.css'

const FileUpload = ({ onFileUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null)

  const onDrop = (acceptedFiles) => {
    uploadFile()
    setSelectedFile(acceptedFiles[0])
  }

  const uploadFile = async () => {
    try {
      onFileUploadSuccess()
      //    }
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div>
      <div className={styles.uploadText_step_one} {...getRootProps()}>
        <input {...getInputProps()} />
        <p className={sharedStyles.aiNoMargin}>Upload Specific Document</p>
      </div>
    </div>
  )
}

export default FileUpload
