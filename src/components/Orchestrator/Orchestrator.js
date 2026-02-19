import React, { useState, useEffect } from 'react'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import styles from '../Aicodegen/Aicodegen.module.css'
import sharedStyles from '../../aicodegen.module.css'
import Document from '../../assets/icons/Document.png'
import {
  useStepOneContext,
  withStepOneValues,
} from '../../context/firstStepContext'
import { Alert, AlertTitle, Button, Grid } from '@mui/material'
import TextField from '@mui/material/TextField'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import Tooltip from '@mui/material/Tooltip'

function OrchestratorSteps({
  firstStepValues,
  setFirstStepValues,

  apiHostOptions,
  accessToken,

  handleClick,
  handleChange,
  targetSystems,

  codeError,

  ConnectionType,
  timeOptions,
  authOptions,
  handleAccessTokenChange,
  setSelectedButton,
  selectedButton,

  handleChangeConnectionType,
}) {
  const isPythonSelected = firstStepValues.programming_language === 'python'
  const isJavaSelected = firstStepValues.programming_language === 'java'
  const isTargetSystemSelected = !!firstStepValues.target_system
  const isBuildtoolSelested = !!firstStepValues.build_tool
  const [generateCodeClicked, setGenerateCodeClicked] = React.useState(false)
  const [generateCodeClickedTool, setGenerateCodeClickedTool] =
    React.useState(false)
  const [selectButton, setselectButton] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showFields, setShowFields] = useState(false)
  const [showFieldsOf, setShowFieldsOf] = useState(false)
  const [selectedTargetSystem, setSelectedTargetSystem] = useState('')
  const [showNewSystemInput, setShowNewSystemInput] = useState(false)
  const [selectedSystem, setSelectedSystem] = useState('')
  const [newSystemName, setNewSystemName] = useState('')
  const [customSystem, setCustomSystem] = useState('')
  const [selectButtonCache, setselectButtonCache] = useState('Yes')

  const handleButtonClick = (buttonOption) => {
    setSelectedButton(buttonOption)
  }

  const handleButtonClick1 = () => {
    setShowFields(!showFields)
  }

  const handleButtonClickCache = (buttonOption) => {
    setselectButtonCache(buttonOption)
  }

  const textFieldStyles = {
    boxShadow: '0px 4px 2px 0px rgba(0, 0, 0, 0.25)',
    width: '45%',
    borderRadius: '10px',
    height: 'auto',
    marginBottom: '1rem',
    marginRight: '1rem',
  }
  const inputLabelProps = { className: sharedStyles.aiInputLabel }

  const handleChange1 = (event) => {
    handleChange(event)
    const { name, value } = event.target
    if (name === 'target_system') {
      setSelectedTargetSystem(value)
      setShowFieldsOf(value !== '+ new Target System')
    }
    setSelectedSystem(value)
    if (value === '+ new Target System') {
      setCustomSystem('')
    }
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  return (
    <div className={styles.step_two_section}>
      <div>
        <span className={styles.step_three_header}>Uploaded BPMN 2.0 file</span>
        <img alt='Back' src={Document} className={styles.backImage} />
      </div>
      <div className={styles.step_three_tile}>
        <div className={styles.sub_div}>File Name: </div>
        <div className={styles.sub_div_name_tm}>
          {' '}
          {firstStepValues.swaggerDocumentPath}
        </div>
      </div>
      <div className={styles.drop_down_cont}>
        <TextField
          select
          name='target_db_type'
          value={firstStepValues.target_db_type}
          onChange={handleChange}
          label='Orchestrate Using'
          fullWidth
          className={sharedStyles.aiFieldShadow}
          InputLabelProps={inputLabelProps}
        >
          <MenuItem value='finxCode'>Speedstack Code</MenuItem>
          <MenuItem value='camundaZeebe'>Camunda zeebe</MenuItem>
          <MenuItem value='conductor'>Conductor</MenuItem>
        </TextField>
      </div>

      <div className={sharedStyles.aiWidthFull}>
        {firstStepValues.target_db_type === 'finxCode' && (
          <>
            <div className={styles.drop_down_cont_adapter}>
              <TextField
                select
                name='programming_language'
                value={firstStepValues?.programming_language}
                onChange={handleChange}
                label='Programming Language'
                className={sharedStyles.aiFieldShadow}
                fullWidth
                InputLabelProps={inputLabelProps}
              >
                <MenuItem value='java'>Java (version 17)</MenuItem>
                <MenuItem value='python'>Python</MenuItem>
              </TextField>
              {selectedSystem === '+ new Target System' && (
                <Button label='Target System Name'>
                  <Tooltip
                    title={
                      <p className={sharedStyles.aiTooltipText}>
                        add new target system
                      </p>
                    }
                    placement='top'
                  >
                    <img
                      src='https://cdn-icons-png.flaticon.com/128/6780/6780311.png'
                      className={styles.backImage3}
                    />
                  </Tooltip>
                </Button>
              )}
              <TextField
                select
                fullWidth
                sx={{
                  marginLeft: '1rem',
                  boxShadow: '0px 4px 2px 0px rgba(0, 0, 0, 0.25)',
                  borderRadius: '10px',
                }}
                onChange={handleChange}
                name='build_tool'
                label='Build Tool'
                value={firstStepValues.build_tool}
                InputLabelProps={inputLabelProps}
              >
                <MenuItem value='gradle'>Gradle</MenuItem>
                <MenuItem value='maven'>Maven</MenuItem>
              </TextField>
            </div>
            <div className={styles.box_button}>
              <span className={styles.sub_div_name1}>
                Nature of Data Model:
              </span>
              <section>
                <button
                  className={`${styles.Two_button_option1} ${
                    selectedButton === 'flexible' ? '' : styles.disable_button
                  }`}
                  onClick={() => handleButtonClick('flexible')}
                >
                  Flexible
                </button>
                <button
                  className={`${styles.Two_button_option2} ${
                    selectedButton === 'strong' ? '' : styles.disable_button
                  }`}
                  onClick={() => handleButtonClick('strong')}
                >
                  Strong
                </button>
              </section>
            </div>
            <div className={styles.box_button}>
              <span className={styles.sub_div_name1}>Enable Cache:</span>
              <section>
                <button
                  className={`${styles.Two_button_option1} ${
                    selectButtonCache === 'Yes' ? '' : styles.disable_button
                  }`}
                  onClick={() => handleButtonClickCache('Yes')}
                >
                  Yes
                </button>
                <button
                  className={`${styles.Two_button_option2} ${
                    selectButtonCache === 'No' ? '' : styles.disable_button
                  }`}
                  onClick={() => handleButtonClickCache('No')}
                >
                  No
                </button>
              </section>
            </div>
          </>
        )}
        {firstStepValues.target_db_type === 'camundaZeebe' && (
          <div className={styles.drop_down_cont_camunda}>
            <TextField
              name='programming_language'
              value={firstStepValues?.programming_language}
              onChange={handleChange}
              label='Zeebe Server URL'
              fullWidth
              className={sharedStyles.aiFieldShadow}
              InputLabelProps={inputLabelProps}
            />

            <TextField
              fullWidth
              onChange={handleChange1}
              name='target_system'
              className={sharedStyles.aiFieldShadow}
              label='Process ID'
              value={firstStepValues.target_system}
              InputLabelProps={inputLabelProps}
            />

            <TextField
              fullWidth
              onChange={handleChange1}
              name='target_system'
              className={sharedStyles.aiFieldShadow}
              label='Process Name'
              value={firstStepValues.target_system}
              InputLabelProps={inputLabelProps}
            />
          </div>
        )}
        {firstStepValues.target_db_type === 'conductor' && (
          <div className={sharedStyles.aiComingSoon}>Coming Soon..</div>
        )}
        <div className={styles.step_five_section}>
          {isPythonSelected && (
            <Alert severity='warning' className={styles.setp_gap_section}>
              <AlertTitle>Python is currently not supported.</AlertTitle>
            </Alert>
          )}
          {codeError && (
            <Alert severity='error' className={styles.setp_gap_section}>
              <AlertTitle>Failed to run Generator.</AlertTitle>
            </Alert>
          )}
          {generateCodeClicked && !isTargetSystemSelected && (
            <Alert severity='warning' className={styles.setp_gap_section}>
              <AlertTitle>Please select Target system.</AlertTitle>
            </Alert>
          )}
          {generateCodeClickedTool && !isBuildtoolSelested && (
            <Alert severity='warning'>
              <AlertTitle>Please select Build Tool.</AlertTitle>
            </Alert>
          )}
        </div>

        {/* <div className={styles.box_button}>
          <span className={styles.sub_div_name1}>Nature of Data Model:</span>
          <section>
            <button
              className={`${styles.Two_button_option1} ${
                selectedButton === "flexible" ? "" : styles.disable_button
              }`}
              onClick={() => handleButtonClick("flexible")}
            >
              Flexible
            </button>
            <button
              className={`${styles.Two_button_option2} ${
                selectedButton === "strong" ? "" : styles.disable_button
              }`}
              onClick={() => handleButtonClick("strong")}
            >
              Strong
            </button>
          </section>
        </div> */}
        {/* <div className={styles.box_button}>
          <span className={styles.sub_div_name1}>Enable Cache:</span>
          <section>
            <button
              className={`${styles.Two_button_option1} ${
                selectButtonCache === "Yes" ? "" : styles.disable_button
              }`}
              onClick={() => handleButtonClickCache("Yes")}
            >
              Yes
            </button>
            <button
              className={`${styles.Two_button_option2} ${
                selectButtonCache === "No" ? "" : styles.disable_button
              }`}
              onClick={() => handleButtonClickCache("No")}
            >
              No
            </button>
          </section>
        </div> */}
      </div>
      <div className={styles.step_three_button_holder}>
        <button
          className={`${styles.buttom_container} ${
            isJavaSelected ? '' : styles.disable_button
          }`}
          onClick={() => {
            setGenerateCodeClicked(true)
            setGenerateCodeClickedTool(true)
            if ((isTargetSystemSelected, isBuildtoolSelested)) {
              handleClick()
            }
          }}
        >
          Generate Code
        </button>
        <button className={styles.buttom_container} onClick={handleClick}>
          <div>Explore</div>
        </button>
        <button className={styles.buttom_container} onClick={handleClick}>
          Share...
        </button>
      </div>
    </div>
  )
}

export default withStepOneValues(OrchestratorSteps)
