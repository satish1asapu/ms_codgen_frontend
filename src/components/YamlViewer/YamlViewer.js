// YamlViewer.js
import React, { useState, useEffect } from 'react'
import ProgressModal from '../Aicodegen/ProgressModal'
import { BASE_URL } from '../../constants/constants.jsx'
import sharedStyles from '../../aicodegen.module.css'

const YamlViewer = ({ url, selectedTab, onTestJobIdReceived }) => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url }),
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${BASE_URL}/api/get_yaml`, requestOptions)

        if (!response.ok) {
          throw new Error(`Failed to fetch the URL. Status: ${response.status}`)
        }

        // Fetch response based on selectedTab
        let content
        if (selectedTab === 'CRUD') {
          content = await response.text()
        } else {
          content = await response.json()
        }

        if (content && content.testJobId && onTestJobIdReceived) {
          onTestJobIdReceived(content.testJobId)
        }
        setContent(content)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching or parsing content:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [url, selectedTab])

  const headingText =
    selectedTab === 'Adapter'
      ? 'YAML Content:'
      : selectedTab === 'CRUD'
      ? 'Schema Content:'
      : 'BPMN 2.0 Content:'

  return (
    <div className={sharedStyles.aiYamlContainer}>
      {loading && <ProgressModal open text='' />}
      <h2>{headingText}</h2>
      <code>
        {selectedTab === 'CRUD' ? content : JSON.stringify(content, null, 2)}
      </code>
    </div>
  )
}

export default YamlViewer
