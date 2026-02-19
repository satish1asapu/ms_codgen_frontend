import {
  TextField,
  Tooltip,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  InputAdornment,
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import {
  withStepOneValues,
  useStepOneContext,
} from '../../context/firstStepContext.js'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import { BASE_URL, CONFIG_BASE_URL } from '../../constants/constants.jsx'
import axios from 'axios'
import styled from '@emotion/styled'
import styles from '../Aicodegen/Aicodegen.module.css'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CloseIcon from '@mui/icons-material/Close'
import sharedStyles from '../../aicodegen.module.css'

const StyledToggleButton = styled(ToggleButton)({
  height: '32px',
  width: '58px',
  '&.Mui-selected': {
    backgroundColor: 'black',
    color: 'white',
  },
})

function Firststepform({
  children,
  firstStepValues,
  setFirstStepValues,
  handleChange,
  isMicroserviceNameExist,
  setisMicroserviceNameExist,
  isEmailValid,
  setIsEmailValid,
  specialCharacterError,
  setspecialCharacterError,
  setShowYamlError,
  showPopup,
  setShowPopup,
  setErrorOccurred,
  selectedTab,
  setSelectedTab,
  setMissingYamlError,
  inputData,
  baseIntegrationType,
  setBaseIntegrationType,
}) {
  const [testError, settestError] = useState('')
  const [toggleValue, setToggleValue] = useState('NO')
  const inputLabelProps = { className: sharedStyles.aiInputLabel }

  const handleMicroserviceNameChange = (event) => {
    handleChange(event)

    const sanitizedValue = event.target.value

    if (/[^a-z0-9]/.test(sanitizedValue)) {
      setspecialCharacterError(true)
    } else {
      setspecialCharacterError(false)
    }

    setFirstStepValues({
      ...firstStepValues,
      applicationName: sanitizedValue,
    })
  }

  const checkApplicationNameExist = () => {
    const { applicationName } = firstStepValues
    const microserviceExists = inputData.find(
      (item) => item.microserviceName === applicationName
    )

    if (microserviceExists) {
      setisMicroserviceNameExist(true)
    } else {
      setisMicroserviceNameExist(false)
    }
  }

  const setApplicationName = async () => {
    try {
      if (!firstStepValues.swaggerDocumentPath) {
        // If swaggerDocumentPath is empty, return early and skip validation
        return
      }

      const segments = firstStepValues.swaggerDocumentPath.split('/')
      const filename = segments[segments.length - 1]
      const filenameWithoutExtension = filename.split('.')[0]
      const microserviceName = filenameWithoutExtension
        .replace(/[^a-zA-Z]/gi, '')
        .toLowerCase()

      setFirstStepValues({
        ...firstStepValues,
        applicationName: microserviceName,
      })

      const response = await axios.post(
        `${BASE_URL}/api/validateYaml`,
        {
          yamlUrl: firstStepValues.swaggerDocumentPath,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error) {
      setisMicroserviceNameExist(false)
      console.error(error)
      setMissingYamlError(true)
      setShowYamlError(false)
      const data = error?.response?.data
      settestError(
        data?.errors.map((error, index) => (
          <div key={index}>
            <p>
              {index + 1}. {error}
            </p>
          </div>
        ))
      )
      setErrorOccurred(true)
      setShowPopup(true)
      setShowYamlError(true)
    }
  }

  const handlePopupClose = () => {
    setShowPopup(false)
    setMissingYamlError(false)
    setShowYamlError(false)
    setErrorOccurred(false)
    setFirstStepValues({
      groupId: '',
      swaggerDocumentPath: '',
      applicationName: '',
      version: '1.0.0-SNAPSHOT',
      basePath: '/v3',
      applicationTargetPath: '/home/ubuntu/projects/',
      controllersPackage: '',
      programming_language: '',
      target_system: '',
      build_tool: '',
      developerEmails: '',
      target_system_apiHost: '',
      connection_Type: '',
      code_gen_type: '',
      target_db_type: '',
      data_source_url: '',
      data_source_driver_name: '',
      data_source_username: '',
      data_source_password: '',
    })
  }

  const setApplicationNameExist = () => {
    axios
      .get(`${CONFIG_BASE_URL}/config/microserviceName`, {
        params: { microserviceName: firstStepValues.applicationName },
      })
      .then((res) => {
        setisMicroserviceNameExist(res.data.isMicroserviceNameExist)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  const validateMultipleEmails = (value) => {
    const emails = value.split(/[;,]/)
    setIsEmailValid(emails.every(validateEmail))
  }

  const handleNavigationButtonClick = (tab) => {
    setSelectedTab(tab)

    // setCardType(type);
  }

  const handleButtonClick = (buttonOption) => {
    setBaseIntegrationType(buttonOption)
  }

  return (
    <div>
      {(selectedTab === 'Adapter' || 'CRUD' || 'Orchestrator') && (
        <div>
          {selectedTab === 'Orchestrator' && (
            <div className={styles.bpmnContainer}>
              <div>
                <p className={styles.bpmnHeading}>
                  BPMN2.0 File Link Available?
                </p>
              </div>
              <div>
                <ToggleButtonGroup
                  value={toggleValue}
                  exclusive
                  onChange={(event, newValue) => setToggleValue(newValue)}
                >
                  <StyledToggleButton value='YES'>YES</StyledToggleButton>
                  <StyledToggleButton value='NO'>NO</StyledToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
          )}

          <div className={styles.swaggerContainer}>
            {selectedTab === 'Adapter' && (
              <div className={styles.toggleButtonContainerBase}>
                <div className={styles.box_button_base}>
                  <span className={styles.sub_div_name1}>
                    Integrate Speedstack Base as :
                  </span>
                  <section>
                    <button
                      className={`${styles.Two_button_option_base} ${
                        baseIntegrationType === 'apis'
                          ? ''
                          : styles.disable_button
                      }`}
                      onClick={() => handleButtonClick('apis')}
                    >
                      APIs
                    </button>

                    <button
                      className={`${styles.Two_button_option2} ${
                        baseIntegrationType === 'lib'
                          ? ''
                          : styles.disable_button
                      }`}
                      onClick={() => handleButtonClick('lib')}
                    >
                      Lib (jar file)
                    </button>
                  </section>
                </div>
                <Tooltip
                  title='Note : jar file contains the components  for config, logs, transformer, schedule, exceptionhandling, req-resvalidation'
                  arrow
                >
                  <InfoOutlinedIcon sx={{ color: '#0090ff' }} />
                </Tooltip>
              </div>
            )}
            <div className={styles.swaggerText}>
              {(selectedTab === 'CRUD' ||
                selectedTab === 'Adapter' ||
                selectedTab === 'Composite' ||
                (selectedTab === 'Orchestrator' && toggleValue === 'YES')) && (
                <TextField
                  className={styles.textfieldStyles}
                  label={
                    selectedTab === 'CRUD'
                      ? 'Schema File Url'
                      : selectedTab === 'Adapter' || selectedTab === 'Composite'
                      ? 'Swagger Document Path'
                      : 'BPMN2.0 File Link'
                  }
                  name='swaggerDocumentPath'
                  onChange={handleChange}
                  InputLabelProps={inputLabelProps}
                  value={firstStepValues?.swaggerDocumentPath}
                  variant='outlined'
                  onBlur={setApplicationName}
                  InputProps={
                    selectedTab === 'Adapter' || selectedTab === 'Composite'
                      ? {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <Tooltip
                                title={
                                  <div>
                                    1) In the YAML, avoid leaving spaces between
                                    lines. <br />
                                    2) The component's name needs to be stated
                                    clearly, such as for Post-Initiate,
                                    Get-Retrieve, or Put-Update. <br />
                                    3) Every object in a request body should be
                                    created as a distinct component.
                                    <br />
                                    4) A field's description, format, and type
                                    should be included when defining it.
                                    <br />
                                    5) MS code zen is not accepting array.
                                    <br />
                                    6) Application name should be a string,
                                    which should not contain any numbers.
                                  </div>
                                }
                                arrow
                              >
                                <InfoOutlinedIcon sx={{ color: '#0090ff' }} />
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }
                      : {}
                  }
                />
              )}
            </div>
            <Popup
              open={showPopup}
              onClose={handlePopupClose}
              modal
              closeOnDocumentClick
            >
              <div className={styles.popupContainer}>
                <div className={styles.popupContent}>
                  <div className={styles.popupHeader}>
                    <h2
                      className={`${styles.popupTitle} ${
                        selectedTab === 'CRUD'
                          ? styles.popupTitleCrud
                          : styles.popupTitleAdapter
                      }`}
                    >
                      {selectedTab === 'CRUD'
                        ? 'Invalid schema syntax'
                        : 'Invalid yaml syntax'}
                    </h2>
                    <button
                      className={`${styles.popupCloseButton} close`}
                      onClick={() => setShowPopup(false)}
                    >
                      <CloseIcon />
                    </button>
                  </div>

                  <div className={styles.popupMessageContainer}>
                    <p className={styles.popupMessage}>{testError}</p>
                  </div>
                </div>
              </div>
            </Popup>
            {showPopup ? (
              <Typography className={sharedStyles.aiErrorBanner}>
                Invalid Yaml
              </Typography>
            ) : null}
            {selectedTab === 'Composite' && (
              <TextField
                className={styles.textfieldStyles}
                label={'Schema File Url'}
                name='swaggerSqlDocumentPath'
                onChange={handleChange}
                InputLabelProps={inputLabelProps}
                value={firstStepValues?.swaggerSqlDocumentPath}
                variant='outlined'
              />
            )}
            <TextField
              className={styles.textfieldStyles}
              label={
                selectedTab === 'Adapter' || 'Composite'
                  ? 'Microservice Name'
                  : 'Application Name'
              }
              name='applicationName'
              onChange={handleMicroserviceNameChange}
              onBlur={checkApplicationNameExist}
              InputLabelProps={inputLabelProps}
              inputProps={{
                pattern: '^[a-zA-Z0-9]+$',
                title: 'Please enter only alphabets',
              }}
              value={firstStepValues?.applicationName}
              variant='outlined'
            />
            {specialCharacterError && (
              <Typography className={sharedStyles.aiErrorInline}>
                {selectedTab === 'Adapter'
                  ? 'Microservice Name'
                  : 'Application Name'}{' '}
                cannot contain special characters or uppercase letters and
                numbers
              </Typography>
            )}
            {isMicroserviceNameExist ? (
              <Typography className={sharedStyles.aiErrorInline}>
                {selectedTab === 'Adapter'
                  ? 'Microservice Name'
                  : 'Application Name'}{' '}
                Already Exist
              </Typography>
            ) : null}
            <TextField
              className={`${styles.textfieldStyles} ${styles.marginBottom}`}
              sx={{ marginBottom: '20px' }}
              label='Developers, Emails'
              name='developerEmails'
              onChange={handleChange}
              onBlur={() =>
                validateMultipleEmails(firstStepValues.developerEmails)
              }
              InputLabelProps={inputLabelProps}
              value={firstStepValues?.developerEmails}
              variant='outlined'
            />{' '}
          </div>
          {!isEmailValid && (
            <Typography className={sharedStyles.aiErrorInline}>
              Please enter a valid email.
            </Typography>
          )}
          {children}
        </div>
      )}
    </div>
  )
}

export default withStepOneValues(Firststepform)
