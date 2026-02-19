import React, { useState } from 'react'
import sharedStyles from '../../aicodegen.module.css'

const ExpandableSection = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpandedState = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div>
      <div
        className={sharedStyles.aiExpandableBody}
        onClick={toggleExpandedState}
      >
        <div className={sharedStyles.aiExpandableFirst}>
          <span>{title}</span>
        </div>
        <div className={sharedStyles.aiExpandableSecond}>
          {isExpanded ? '▼' : '►'}
        </div>
      </div>
      {isExpanded && <div className='content'>{children}</div>}
    </div>
  )
}

export default ExpandableSection
