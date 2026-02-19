import React, { useState, useEffect } from 'react'
import Stepper from '@keyvaluesystems/react-vertical-stepper'
import {
  initialStepsArr,
  initialCrudStepsArr,
  initialOrchestratorStepsArr,
} from './constants'
import Back from '../../assets/icons/Back.png'
import Upload from '../../assets/icons/Upload.png'
import Example from '../../assets/icons/Example.png'
import Document from '../../assets/icons/Document.png'
import Zip from '../../assets/icons/Zip.png'
import Download from '../../assets/icons/Download.png'
// import liquidParser from '../../liquid/liquidParser'
import styles from './Aicodegen.module.css'
import sharedStyles from '../../aicodegen.module.css'
import StepperFunction from './stepper'
import OrchestratorSteps from '../Orchestrator/Orchestrator.js'
import ProgressModal from './ProgressModal'
import Tooltip from '@mui/material/Tooltip'
import Firststepform from '../forms/Firststepform.js'
import {
  withStepOneValues,
  useStepOneContext,
} from '../../context/firstStepContext.js'
import CrudStepperFunction from '../Crud/CrudStepper.js'
import CompositeStepper from '../Composite/CompositeStepper.js'
import YamlViewer from '../YamlViewer/YamlViewer.js'
import FileExplorer from '../FileExplorer/FileExplorer.jsx'
import CodePreviewComponent from '../FilePreview/FilePreview.jsx'
import { BASE_URL, CONFIG_BASE_URL } from '../../constants/constants.jsx'
import axios from 'axios'
import { saveAs } from 'file-saver'

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [versionName, setVersionName] = useState([])

  const [showBottomDiv, setShowBottomDiv] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progressText, setProgressText] = useState('')
  const [absolutePath, setAbsolutePath] = useState('')
  const [previewData, setPreviewData] = useState({})
  const { firstStepValues, setFirstStepValues } = useStepOneContext()
  const [previewCode, setPreviewCode] = useState({})
  const [isMicroserviceNameExist, setisMicroserviceNameExist] = useState(false)
  const [specialCharacterError, setspecialCharacterError] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [errorOccurred, setErrorOccurred] = useState(false)
  const [showYamlError, setShowYamlError] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [codeError, setCodeError] = React.useState(false)
  const [selectedTab, setSelectedTab] = useState('Adapter')
  const [inputData, setInputData] = useState([])
  const [accessToken, setAccessToken] = useState({
    accessTokenVariant: '',
    isTokenCached: '',
    isWWWUrlEncodingRequired: '',
    accessTokenEndpointUrl: '',
    validUpto: '',
    tokenKeyValuePair: {},
  })
  const [selectedButton, setSelectedButton] = useState('flexible')
  const [baseIntegrationType, setBaseIntegrationType] = useState('apis')
  const [missingYamlError, setMissingYamlError] = useState(false)
  const [showSubscribeField, setShowSubscribeField] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedFile, setSelectedFile] = useState(null)
  const [bpmnContent, setBpmnContent] = useState(null)
  const [pairs, setPairs] = useState([
    { key: 'username', value: '' },
    { key: 'password', value: '' },
  ])
  const [identityProvider, setIdentityProvider] = useState({})
  const [showSwaggerSqlInput, setShowSwaggerSqlInput] = useState(false)
  const [swaggerSqlTempValue, setSwaggerSqlTempValue] = useState('')

  const [showSwaggerDocInput, setShowSwaggerDocInput] = useState(false)
  const [swaggerDocTempValue, setSwaggerDocTempValue] = useState('')
  const [kafka, setKafka] = useState({})
  const [testJobId, setTestJobId] = useState('')

  const handleNavigationButtonClick = (tab) => {
    setSelectedTab(tab)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)

    setAccessToken((prevAccessToken) => ({
      ...prevAccessToken,
      validUpto: date.toISOString(),
    }))
  }
  const fetchAccessToken = async (targetSystem) => {
    try {
      const response = await fetch(
        `http://localhost:8080/config/parsed/search/token?coreId=${targetSystem}`
      )
      if (!response.ok) {
        throw new Error(`Failed to fetch token details: ${response.statusText}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching access token details:', error)
      return null
    }
  }

  console.log(accessToken, 'accessToken')

  const handleFetchToken = async () => {
    if (!firstStepValues?.target_system) {
      console.error('Target system is not defined.')
      return
    }

    const data = await fetchAccessToken(firstStepValues.target_system)
    if (data) {
      setAccessToken(data)
    }
  }
  useEffect(() => {
    if (firstStepValues?.target_system) {
      handleFetchToken()
    }
  }, [firstStepValues?.target_system])
  const coreIds = [
    ...new Set(
      inputData
        .map((item) => item.coreId)
        .filter(
          (coreId) =>
            coreId !== 'MAMBU' &&
            coreId !== 'ComplyAdvantag' &&
            coreId !== 'testAPi'
        )
        .map((coreId) => (coreId === 'TM' ? 'Thought Machine' : coreId))
    ),
  ]
  const apiHostOptions = [
    ...new Set(
      inputData
        .filter((item) => item.coreId === firstStepValues.target_system)
        .map((item) => item.apiHost)
    ),
  ]

  const handleChangeFirstStep = (e) => {
    setFirstStepValues({ ...firstStepValues, [e.target.name]: e.target.value })
  }

  const handleAddSwaggerSqlUrl = () => {
    if (swaggerSqlTempValue.trim() !== '') {
      setFirstStepValues({
        ...firstStepValues,
        swaggerSqlDocumentPath: [
          ...firstStepValues.swaggerSqlDocumentPath,
          swaggerSqlTempValue.trim(),
        ],
      })
      setSwaggerSqlTempValue('')
      setShowSwaggerSqlInput(false)
    }
  }

  const handleAddSwaggerDocUrl = () => {
    if (swaggerDocTempValue.trim() !== '') {
      setFirstStepValues({
        ...firstStepValues,
        swaggerDocumentPath: [
          ...firstStepValues.swaggerDocumentPath,
          swaggerDocTempValue.trim(),
        ],
      })
      setSwaggerDocTempValue('')
      setShowSwaggerDocInput(false)
    }
  }

  const handleDeleteSwaggerSqlUrl = (index) => {
    const updated = [...firstStepValues.swaggerSqlDocumentPath]
    updated.splice(index, 1)
    setFirstStepValues({ ...firstStepValues, swaggerSqlDocumentPath: updated })
  }

  const handleDeleteSwaggerDocUrl = (index) => {
    const updated = [...firstStepValues.swaggerDocumentPath]
    updated.splice(index, 1)
    setFirstStepValues({ ...firstStepValues, swaggerDocumentPath: updated })
  }

  const onFileBlur = () => {
    if (!selectedFile) return

    const reader = new FileReader()
    reader.onload = () => {
      const fileContent = reader.result
      setBpmnContent(fileContent)

      const processIdMatch = fileContent.match(/process id="([^"]+)"/)
      if (processIdMatch) {
        const processId = processIdMatch[1]
        setFirstStepValues((prevValues) => ({
          ...prevValues,
          processId: processId,
        }))
      }
    }
    reader.readAsText(selectedFile)
  }
  const uploadFile = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)
    try {
      const response = await fetch(
        'https://api-dev.fincuro.com/v1/accenture/zeebe/deploy',
        {
          method: 'POST',
          body: formData,
        }
      )

      if (response.ok) {
        const data = await response.json()
      } else {
        console.error('File upload failed with status:', response.status)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleChangeConnectionType = (event) => {
    setFirstStepValues({
      ...firstStepValues,
      [event.target.name]: event.target.value,
    })
    const selectedType = event.target.value
    setShowSubscribeField(selectedType === 'Streaming')
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(false)
  }
  const handleFormSubmit = () => {
    closeModal()
  }

  const downloadZip = () => {
    fetch(`${BASE_URL}/api/download`)
      .then((res) => res.json())
      .then((json) => {
        if (json.downloadURL) {
          const link = document.createElement('a')
          link.href = json.downloadURL

          link.setAttribute('download', 'filename.ext')
          document.body.appendChild(link)
          link.click()

          document.body.removeChild(link)
        } else {
          console.error('No signed URL available. Make sure to fetch it first.')
        }
      })
  }

  function containsUppercase(str) {
    return /[A-Z]/.test(str)
  }

  const downloadFile = async (fileUrl) => {
    try {
      const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/'
      const response = await axios.get(corsProxyUrl + fileUrl, {
        responseType: 'blob',
        headers: {
          Origin: 'http://localhost:3001', // Replace with your frontend origin
        },
      })

      const fileName = fileUrl.split('/').pop()
      const blob = new Blob([response.data])
      saveAs(blob, fileName)
      return true // Indicate success
    } catch (error) {
      console.error('Error downloading the file:', error)
      return false // Indicate failure
    }
  }

  const handleContinueClickOrchestrator = async () => {
    setCurrentStep(currentStep + 1)
  }

  const handleSubmitAdapter = async () => {
    setLoading(true)
    const isValidDate = (date) => date instanceof Date && !isNaN(date)

    const {
      target_db_type,
      data_source_url,
      data_source_driver_name,
      data_source_username,
      data_source_password,
      configuration,
      zeebeUrl,
      processId,
      ...filteredValues
    } = firstStepValues

    filteredValues.code_gen_type =
      baseIntegrationType === 'lib' ? 'adapter_jar' : 'adapter'

    const filterEmptyValues = (obj) =>
      Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== ''))

    
    const convertTokenKeyValuePairToObject = (tokenKeyValuePair) => {
      if (!tokenKeyValuePair) return {}
      if (Array.isArray(tokenKeyValuePair)) {
       
        return tokenKeyValuePair.reduce((acc, pair) => {
          if (pair.name && pair.value !== undefined) {
            acc[pair.name] = pair.value
          }
          return acc
        }, {})
      }
      // Already an object, return as is
      return tokenKeyValuePair
    }

    const optionsObject = pairs.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {})

   
    const tokenKeyValuePairObject = convertTokenKeyValuePairToObject(
      accessToken.tokenKeyValuePair
    )

    const filteredAccessToken = filterEmptyValues({
      ...accessToken,
      tokenKeyValuePair: filterEmptyValues({
        ...tokenKeyValuePairObject,
        ...optionsObject,
      }),
      validUpto: isValidDate(new Date(accessToken.validUpto))
        ? new Date(accessToken.validUpto).toISOString()
        : '',
    })

    const requestBody = {
      ...filteredValues,
      developerEmails: firstStepValues.developerEmails.split(','),
      accessToken: filteredAccessToken,
      dataModel: selectedButton,
      identityProvider: identityProvider,
    }

    if (testJobId) {
      requestBody.testGenerationJobId = testJobId
    }

    // Add kafka credentials if connection type is kafka
    if (firstStepValues.connection_Type === 'kafka') {
      requestBody.kafka_credentials = filterEmptyValues(kafka)
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    }

    try {
      await fetch(`${BASE_URL}/api/store-form-data`, requestOptions)
      const asyncResponse = await fetch(
        `${BASE_URL}/api/run-generator-async`,
        requestOptions
      )

      if (!asyncResponse.ok) {
        setCodeError(true)
        return
      }

      const asyncData = await asyncResponse.json()
      const jobId = asyncData?.jobId || null

      if (!jobId) {
        console.error('Generator job id missing in async response')
        setCodeError(true)
        return
      }

      const maxPollAttempts = 100
      const pollIntervalMs = 3000
      const jobStatusUrl = `${BASE_URL}/api/generator-job-status/${jobId}`

      const successStatuses = ['success', 'completed']
      const failureStatuses = ['failed', 'error']

      for (let attempt = 0; attempt < maxPollAttempts; attempt += 1) {
        const statusResponse = await fetch(jobStatusUrl)

        if (!statusResponse.ok) {
          throw new Error('Failed to fetch generator job status')
        }

        const statusData = await statusResponse.json()
        const jobStatus =
          statusData?.status ||
          statusData?.data?.status ||
          statusData?.jobStatus ||
          ''

        if (successStatuses.includes(jobStatus.toLowerCase())) {
          setCurrentStep((prev) => prev + 1)
          return
        }

        if (failureStatuses.includes(jobStatus.toLowerCase())) {
          setCodeError(true)
          return
        }

        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))
      }

      console.error('Generator job polling timed out')
      setCodeError(true)
    } catch (error) {
      console.error(error)
      setCodeError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitCrud = async () => {
    setLoading(true)
    const {
      target_system_apiHost,
      zeebeUrl,
      processId,
      target_system,
      secretConfigurationRequired,
      secretConfigurationType,
      client,
      swaggerSqlDocumentPath,
      streaming_endpoint,
      ...filteredValues
    } = firstStepValues
    filteredValues.code_gen_type = 'crud'
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...filteredValues,
        developerEmails: firstStepValues.developerEmails.split(','),
      }),
    }

    try {
      await fetch(`${BASE_URL}/api/store-form-data`, requestOptions)
      const response = await fetch(
        `${BASE_URL}/api/run-generator`,
        requestOptions
      )

      if (response.status !== 200) {
        setCodeError(true)
      } else {
        setCurrentStep(currentStep + 1)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitOrchestrator = async () => {
    setLoading(true)
    if (firstStepValues.swaggerDocumentPath === '') {
      setCurrentStep(currentStep + 1)
      setLoading(false)
    } else {
      const downloadSuccess = await downloadFile(
        firstStepValues.swaggerDocumentPath
      )
      if (downloadSuccess) {
        setCurrentStep(currentStep + 1)
      } else {
        console.error('Failed to download the file')
      }
      setLoading(false)
    }
  }

  const handleSubmitComposite = async () => {
    setLoading(true)
    const isValidDate = (date) => date instanceof Date && !isNaN(date)

    const { zeebeUrl, processId, ...filteredValues } = firstStepValues

    filteredValues.code_gen_type = 'composite'

    const filterEmptyValues = (obj) =>
      Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== ''))

    // Helper function to convert array format to object format for API submission
    const convertTokenKeyValuePairToObject = (tokenKeyValuePair) => {
      if (!tokenKeyValuePair) return {}
      if (Array.isArray(tokenKeyValuePair)) {
        // Convert array [{name: "username", value: "..."}] to object {username: "..."}
        return tokenKeyValuePair.reduce((acc, pair) => {
          if (pair.name && pair.value !== undefined) {
            acc[pair.name] = pair.value
          }
          return acc
        }, {})
      }
      // Already an object, return as is
      return tokenKeyValuePair
    }

    const optionsObject = pairs.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {})

    // Convert tokenKeyValuePair from array to object format
    const tokenKeyValuePairObject = convertTokenKeyValuePairToObject(
      accessToken.tokenKeyValuePair
    )

    const filteredAccessToken = filterEmptyValues({
      ...accessToken,
      tokenKeyValuePair: filterEmptyValues({
        ...tokenKeyValuePairObject,
        ...optionsObject,
      }),
      validUpto: isValidDate(new Date(accessToken.validUpto))
        ? new Date(accessToken.validUpto).toISOString()
        : '',
    })

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...filteredValues,
        developerEmails: firstStepValues.developerEmails.split(','),
        accessToken: filteredAccessToken,
        dataModel: selectedButton,
        identityProvider: identityProvider,
      }),
    }
    try {
      await fetch(`${BASE_URL}/api/store-form-data`, requestOptions)
      const response = await fetch(
        `${BASE_URL}/api/run-generator`,
        requestOptions
      )

      if (response.status === 200) {
        setCurrentStep(currentStep + 1)
      } else {
        console.error('Composite submission failed')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateZipAndUpload = async () => {
    setLoading(true)
    try {
      await fetch(`${BASE_URL}/api/create-zip`, { method: 'POST' })
      await fetch(`${BASE_URL}/api/upload-to-s3`, { method: 'POST' })
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinueClick = async () => {
    if (
      firstStepValues &&
      containsUppercase(firstStepValues.applicationName) &&
      currentStep === 0
    ) {
      setCurrentStep(0)
      return
    }

    if (currentStep === 0) {
      setFirstStepValues({
        ...firstStepValues,
        groupId: `com.speedstack.${firstStepValues.applicationName
          .replace(/[^a-zA-Z0-9]/g, '')
          .toLowerCase()}`,
        version: '1.0.0-SNAPSHOT',
        basePath: '/v3',
        applicationTargetPath: 'C:/Users/harsha/Downloads/',
        controllersPackage: `com.speedstack.${firstStepValues.applicationName
          .replace(/[^a-zA-Z0-9]/g, '')
          .toLowerCase()}.controllers`,
      })
      setCurrentStep(2)
    } else if (currentStep === 3) {
      if (selectedTab === 'Adapter') {
        await handleSubmitAdapter()
      } else if (selectedTab === 'Orchestrator') {
        await handleSubmitOrchestrator()
      } else if (selectedTab === 'Composite') {
        await handleSubmitComposite()
      } else {
        await handleSubmitCrud()
      }
    } else if (currentStep === 4) {
      await handleCreateZipAndUpload()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleStepClick = (step, index) => {
    setCurrentStep(index)

    // Check if step 2 is clicked
    if (index === 1 || index === 2) {
      setShowBottomDiv(true)
    } else {
      setShowBottomDiv(false)
    }
  }

  const ITEM_HEIGHT = 25
  const ITEM_PADDING_TOP = 15
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 100,
        color: '#1C242C',
      },
    },
  }
  const names = ['Java (version 17)', 'Python']

  const ConnectionType = [
    'RESTful',
    'Web Socket',
    'gRPC',
    'Streaming',
    'Async Messaging (kafka)',
  ]

  const timeOptions = [
    '30 minutes',
    '1 hour',
    '5 hours',
    '6 hours',
    '12 hours',
    '1 day',
    '30 days',
  ]
  const authOptions = [
    'Inherit auth from parent',
    'No Auth',
    'Basic',
    'Bearer',
    'JWT Bearer',
    'Digest Auth',
    'OAuth 1.0',
    'OAuth 2.0',
    'Hawk Authentication',
    'AWS Signature',
    'NTLM Authentication [Beta]',
    'API Key',
    'Akamai EdgeGrid',
    'ASAP (Atlassian)',
  ]

  const handleAccessTokenChange = (event) => {
    const { name, value } = event.target
    setAccessToken((prevState) => ({
      ...prevState,
      tokenKeyValuePair:
        name === 'tokenKeyValuePair'
          ? value
          : {
              ...prevState.tokenKeyValuePair,
            },
      [name]: value,
    }))
  }

  const handleTokenKeyValuePairChange = (event) => {
    const { name, value } = event.target
    setAccessToken((prevState) => ({
      ...prevState,
      tokenKeyValuePair: {
        ...prevState.tokenKeyValuePair,
        [name]: value,
      },
    }))
  }

  const handleIdentityProviderChange = (event) => {
    const { name, value } = event.target
    setIdentityProvider((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleKafkaChange = (event) => {
    const { name, value } = event.target
    setKafka((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // const goToHome = () => {
  //   const baseRoute = liquidParser.parse('{{ vars["base-route"] }}')
  //   window.location.href = `${baseRoute}`
  // }

  // const handleBackStep = () => {
  //   if (currentStep === 0) {
  //     goToHome()
  //   } else {
  //     setCurrentStep(currentStep - 1)
  //   }
  // }

  const handleTestJobIdReceived = (jobId) => {
    setTestJobId(jobId)
  }

  useEffect(() => {
    if (
      currentStep === 4 &&
      firstStepValues.applicationName &&
      firstStepValues.applicationTargetPath
    ) {
      ;(() => {
        setLoading(true)

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            directoryPath: `${firstStepValues.applicationTargetPath}${firstStepValues.applicationName}`,
            recursive: true,
          }),
        }
        fetch(`${BASE_URL}/api/openDirectory`, requestOptions)
          .then((response) => {
            return response.json()
          })
          .then((data) => {
            setPreviewData(data)
            setLoading(false)
          })
          .catch((error) => {
            console.log(error)
            setLoading(false)
          })
      })()
    }
  }, [currentStep])

  const getData = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }

    axios
      .get(`${CONFIG_BASE_URL}/config/parsed/all`, requestOptions)
      .then((response) => {
        setInputData(response.data)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const coreIdOptions = [...new Set(inputData.map((item) => item.coreId))]
  const onFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
  }

  useEffect(() => {
    if (currentStep === 4 && absolutePath) {
      ;(() => {
        setLoading(true)
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
        fetch(
          `${BASE_URL}/api/openFile?filePath=${absolutePath}`,
          requestOptions
        )
          .then((response) => {
            return response.json()
          })
          .then((data) => {
            setPreviewCode(data)
            setLoading(false)
          })
          .catch((error) => {
            console.log(error)
            setLoading(false)
          })
      })()
    }
  }, [absolutePath])

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <ProgressModal open={loading} text={progressText} />
        <div className={styles.back_container_head}>
          <div className={styles.sideBar}> </div>
          {/* <div
            className={styles.backContainer}
            onClick={() => handleBackStep()}
          >
            <img alt='Back' src={Back} className={styles.backImage} />
            <div className={styles.designButton}>Back</div>
          </div> */}
        </div>
        <div className={styles.siteBody}>
          <div className={styles.sideBar}>
            <Stepper
              className={styles.align_stepper}
              steps={
                selectedTab === 'Adapter' || selectedTab === 'Composite'
                  ? initialStepsArr
                  : selectedTab === 'CRUD'
                  ? initialCrudStepsArr
                  : initialOrchestratorStepsArr
              }
              currentStepIndex={currentStep}
              onStepClick={handleStepClick}
              labelPosition='right'
              styles={{
                LineSeparator: (step, index) => ({
                  height: '3px',
                  background: '#BBBBBB',
                }),
                LabelTitle: (step, stepIndex) => ({ color: '#BBBBBB' }),
                ActiveLabelTitle: (step, stepIndex) => ({ color: '#006E74' }),
                InActiveBubble: (step, stepIndex) => ({ color: '#1C242C' }),
                Bubble: (step, stepIndex) => ({
                  background: '#BBBBBB',
                  border: 'none',
                  width: '24px',
                  margin: '0px',
                }),
                ActiveBubble: (step, stepIndex) => ({ background: '#006E74' }),
              }}
            />
          </div>
          <div className={styles.mainSection}>
            <div className={styles.title}>
              <label>Speedstack Microservice Generator v2.0 </label>
            </div>
            {currentStep === 0 && (
              <div className={styles.navigationContainer}>
                <div
                  className={`${styles.navigationButton} ${
                    selectedTab === 'Adapter' ? styles.selectedTab : ''
                  }`}
                  onClick={() => handleNavigationButtonClick('Adapter')}
                >
                  Adapter
                </div>
                <div
                  className={`${styles.navigationButton} ${
                    selectedTab === 'CRUD' ? styles.selectedTab : ''
                  } ${styles.leftPadding}`}
                  onClick={() => handleNavigationButtonClick('CRUD')}
                >
                  CRUD
                </div>
                <div
                  className={`${styles.navigationButton} ${
                    selectedTab === 'Orchestrator' ? styles.selectedTab : ''
                  } ${styles.leftPadding}`}
                  onClick={() => handleNavigationButtonClick('Orchestrator')}
                >
                  Orchestrator
                </div>
                <div
                  className={`${styles.navigationButton} ${
                    selectedTab === 'Composite' ? styles.selectedTab : ''
                  } ${styles.leftPadding}`}
                  onClick={() => handleNavigationButtonClick('Composite')}
                >
                  Composite
                </div>
              </div>
            )}

            {currentStep === 0 && (
              <div className={styles.formContainer}>
                <Firststepform
                  firstStepValues={firstStepValues}
                  handleChange={handleChangeFirstStep}
                  setFirstStepValues={setFirstStepValues}
                  setisMicroserviceNameExist={setisMicroserviceNameExist}
                  isMicroserviceNameExist={isMicroserviceNameExist}
                  setspecialCharacterError={setspecialCharacterError}
                  specialCharacterError={specialCharacterError}
                  setShowYamlError={setShowYamlError}
                  showYamlError={showYamlError}
                  showPopup={showPopup}
                  setShowPopup={setShowPopup}
                  errorOccurred={errorOccurred}
                  setErrorOccurred={setErrorOccurred}
                  isEmailValid={isEmailValid}
                  setIsEmailValid={setIsEmailValid}
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                  missingYamlError={missingYamlError}
                  setMissingYamlError={setMissingYamlError}
                  inputData={inputData}
                  handleAddSwaggerSqlUrl={handleAddSwaggerSqlUrl}
                  handleDeleteSwaggerSqlUrl={handleDeleteSwaggerSqlUrl}
                  showSwaggerSqlInput={showSwaggerSqlInput}
                  setShowSwaggerSqlInput={setShowSwaggerSqlInput}
                  swaggerSqlTempValue={swaggerSqlTempValue}
                  setSwaggerSqlTempValue={setSwaggerSqlTempValue}
                  baseIntegrationType={baseIntegrationType}
                  setBaseIntegrationType={setBaseIntegrationType}
                >
                  <button
                    disabled={
                      selectedTab !== 'Orchestrator' &&
                      (isMicroserviceNameExist ||
                        !isEmailValid ||
                        specialCharacterError ||
                        errorOccurred ||
                        !firstStepValues.swaggerDocumentPath ||
                        !firstStepValues.developerEmails.length ||
                        missingYamlError)
                    }
                    className={`${styles.buttom_container2} ${
                      selectedTab !== 'Orchestrator' &&
                      (isMicroserviceNameExist ||
                        !isEmailValid ||
                        specialCharacterError ||
                        errorOccurred ||
                        !firstStepValues.swaggerDocumentPath ||
                        !firstStepValues.developerEmails.length ||
                        missingYamlError)
                        ? styles.disable_button
                        : ''
                    }`}
                    onClick={
                      selectedTab === 'Orchestrator'
                        ? handleContinueClickOrchestrator
                        : handleContinueClick
                    }
                  >
                    Continue
                  </button>
                </Firststepform>
              </div>
            )}

            {currentStep === 1 && (
              <div className={styles.addressSection}>
                {/* <FileUpload
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                onFileUploadSuccess={handleFileUploadSuccess}  
                onDrop={onDrop} 
                ></FileUpload> */}
                <div className={styles.addressSectionFile}>
                  <input
                    type='file'
                    onChange={onFileChange}
                    onBlur={onFileBlur}
                  />
                  <div>
                    <img alt='Back' src={Upload} className={styles.backImage} />
                  </div>
                  <div className={styles.small_text_container}>
                    <img
                      alt='Back'
                      src={Example}
                      className={styles.image_export}
                    />
                    <span className={styles.small_text}>
                      View Example specifications
                    </span>
                  </div>
                </div>
                <button
                  className={styles.buttom_container2}
                  onClick={
                    selectedTab === 'Orchestrator'
                      ? handleContinueClickOrchestrator
                      : handleContinueClick
                  }
                >
                  Continue
                </button>
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <div className={styles.step_two_section_yaml}>
                  <div>
                    {selectedTab === 'Adapter' ? (
                      <span className={styles.uploadText}>
                        Preview yaml Specification file
                      </span>
                    ) : selectedTab === 'CRUD' ? (
                      <span className={styles.uploadText}>
                        Preview Schema file
                      </span>
                    ) : (
                      <span className={styles.uploadText}>
                        Preview BPMN2.0 File
                      </span>
                    )}
                    <img
                      alt='Back'
                      src={Document}
                      className={styles.backImage2}
                    />
                  </div>
                  <div className={styles.term_deposits}>
                    <YamlViewer
                      url={firstStepValues.swaggerDocumentPath}
                      selectedTab={selectedTab}
                      bpmnContent={bpmnContent}
                      onTestJobIdReceived={handleTestJobIdReceived}
                    />
                  </div>

                  <button
                    className={styles.buttom_container3}
                    onClick={handleContinueClick}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div
                className={`${styles.step_two_section2} ${sharedStyles.aiWidthFull}`}
              >
                {selectedTab === 'Adapter' ? (
                  <StepperFunction
                    versionName={versionName}
                    handleChange={handleChangeFirstStep}
                    firstStepValues={firstStepValues}
                    setFirstStepValues={setFirstStepValues}
                    names={names}
                    targetSystems={coreIdOptions}
                    showSubscribeField={showSubscribeField}
                    setShowSubscribeField={setShowSubscribeField}
                    ConnectionType={ConnectionType}
                    timeOptions={timeOptions}
                    authOptions={authOptions}
                    MenuProps={MenuProps}
                    handleClick={handleContinueClick}
                    handleChangeTarget={handleChangeFirstStep}
                    codeError={codeError}
                    setCodeError={setCodeError}
                    setLoading={setLoading}
                    apiHostOptions={apiHostOptions}
                    accessToken={accessToken}
                    handleAccessTokenChange={handleAccessTokenChange}
                    handleTokenKeyValuePairChange={
                      handleTokenKeyValuePairChange
                    }
                    selectedButton={selectedButton}
                    setSelectedButton={setSelectedButton}
                    handleChangeConnectionType={handleChangeConnectionType}
                    coreIds={coreIds}
                    handleDateChange={handleDateChange}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    pairs={pairs}
                    setPairs={setPairs}
                    identityProvider={identityProvider}
                    handleIdentityProviderChange={handleIdentityProviderChange}
                    kafka={kafka}
                    setKafka={setKafka}
                    handleKafkaChange={handleKafkaChange}
                  />
                ) : selectedTab === 'CRUD' ? (
                  <CrudStepperFunction
                    versionName={versionName}
                    handleChange={handleChangeFirstStep}
                    firstStepValues={firstStepValues}
                    setFirstStepValues={setFirstStepValues}
                    names={names}
                    ConnectionType={ConnectionType}
                    timeOptions={timeOptions}
                    authOptions={authOptions}
                    MenuProps={MenuProps}
                    handleClick={handleContinueClick}
                    handleChangeTarget={handleChangeFirstStep}
                    codeError={codeError}
                    setCodeError={setCodeError}
                    handleChangeConnectionType={handleChangeConnectionType}
                  />
                ) : selectedTab === 'Orchestrator' ? (
                  <OrchestratorSteps
                    versionName={versionName}
                    handleChange={handleChangeFirstStep}
                    firstStepValues={firstStepValues}
                    setFirstStepValues={setFirstStepValues}
                    names={names}
                    targetSystems={coreIdOptions}
                    showSubscribeField={showSubscribeField}
                    setShowSubscribeField={setShowSubscribeField}
                    ConnectionType={ConnectionType}
                    timeOptions={timeOptions}
                    authOptions={authOptions}
                    MenuProps={MenuProps}
                    handleClick={handleContinueClick}
                    handleChangeTarget={handleChangeFirstStep}
                    codeError={codeError}
                    setCodeError={setCodeError}
                    setLoading={setLoading}
                    apiHostOptions={apiHostOptions}
                    accessToken={accessToken}
                    handleAccessTokenChange={handleAccessTokenChange}
                    selectedButton={selectedButton}
                    setSelectedButton={setSelectedButton}
                    handleChangeConnectionType={handleChangeConnectionType}
                    uploadFile={uploadFile}
                    selectedFile={selectedFile}
                  />
                ) : (
                  <CompositeStepper
                    versionName={versionName}
                    handleChange={handleChangeFirstStep}
                    firstStepValues={firstStepValues}
                    setFirstStepValues={setFirstStepValues}
                    names={names}
                    targetSystems={coreIdOptions}
                    showSubscribeField={showSubscribeField}
                    setShowSubscribeField={setShowSubscribeField}
                    ConnectionType={ConnectionType}
                    timeOptions={timeOptions}
                    authOptions={authOptions}
                    MenuProps={MenuProps}
                    handleClick={handleContinueClick}
                    handleChangeTarget={handleChangeFirstStep}
                    codeError={codeError}
                    setCodeError={setCodeError}
                    setLoading={setLoading}
                    apiHostOptions={apiHostOptions}
                    accessToken={accessToken}
                    handleAccessTokenChange={handleAccessTokenChange}
                    handleTokenKeyValuePairChange={
                      handleTokenKeyValuePairChange
                    }
                    selectedButton={selectedButton}
                    setSelectedButton={setSelectedButton}
                    handleChangeConnectionType={handleChangeConnectionType}
                    coreIds={coreIds}
                    handleDateChange={handleDateChange}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    pairs={pairs}
                    setPairs={setPairs}
                    identityProvider={identityProvider}
                    handleIdentityProviderChange={handleIdentityProviderChange}
                  />
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className={styles.step_four_section}>
                <div className={styles.expandable_container}>
                  {/* <ExpandableSection title='abc.java'>
                    <pre className={styles.code_container}>
                      <code>{pythonText}</code>
                    </pre>
                  </ExpandableSection>
                </div>
                <div className={styles.expandable_container}>
                  <ExpandableSection title='xu.java'>
                    <pre className={styles.code_container}>
                      <code>{pythonTextTwo}</code>
                    </pre>
                  </ExpandableSection> */}

                  <div className={sharedStyles.aiFileExplorerPane}>
                    <FileExplorer
                      files={previewData.files}
                      setAbsolutePath={setAbsolutePath}
                    />
                  </div>
                  <div className={sharedStyles.aiCodePreviewPane}>
                    <CodePreviewComponent code={previewCode?.content} />
                  </div>
                </div>
                <button
                  className={styles.buttom_container}
                  onClick={handleContinueClick}
                >
                  Continue
                </button>
              </div>
            )}
            {currentStep === 5 && (
              <div className={styles.step_four_section}>
                <div>
                  <span className={styles.sub_div_name}>
                    Please find below Generated MS code
                  </span>
                </div>
                <div className={styles.sub_div_main}>
                  <span className={styles.sub_div2}>
                    Note: Ensure Java 17 and Gradle 8.2 are properly configured
                    in your IDE
                  </span>
                </div>
                <div className={styles.margin_div_30}>
                  <span className={styles.sub_div}>
                    Speedstack Microservices Code
                  </span>
                  <div className={styles.resultTopContainer}>
                    <div className={styles.addressSection}>
                      <img
                        alt='Back'
                        src={Zip}
                        className={styles.text_margin}
                      />
                      <span className={styles.sub_div_name}>
                        {firstStepValues.applicationName}.zip
                      </span>
                    </div>
                    <Tooltip title='Please click here to download' arrow open>
                      <div className={styles.apiTitleBody}>
                        <button
                          className={styles.buttom_container4}
                          onClick={downloadZip}
                        >
                          {' '}
                          <img
                            alt='Back'
                            src={Download}
                            className={styles.backImage3}
                          />
                          Download
                        </button>
                      </div>
                    </Tooltip>
                    <div>
                      <div className={styles.button_place}>
                        <button
                          className={styles.buttom_container4}
                          onClick={openModal}
                        >
                          <img
                            src='https://fincuro.cdn.modyo.com/uploads/538f0456-73c2-41ff-a323-b0d9e0b2d23f/original/image_2025_03_26T05_51_13_816Z.png'
                            alt='Add to git'
                            className={styles.git}
                          />
                        </button>
                        <button className={styles.buttom_container4}>
                          <img
                            src='https://fincuro.cdn.modyo.com/uploads/0a0c518f-ec62-4e97-b2e5-f1ef41c0e9a3/original/image_2025_03_26T05_51_59_780Z.png'
                            alt='Deploy'
                            className={styles.jenkins}
                          />
                        </button>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default withStepOneValues(App)
