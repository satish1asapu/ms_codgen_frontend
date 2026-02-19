// Stepper.js
import React, { useState, useEffect } from 'react'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import styles from '../Aicodegen/Aicodegen.module.css'
import sharedStyles from '../../aicodegen.module.css'
import Document from '../../assets/icons/Document.png'
import { withStepOneValues } from '../../context/firstStepContext.js'
import { Alert, AlertTitle, Button, Grid } from '@mui/material'
import TextField from '@mui/material/TextField'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import Tooltip from '@mui/material/Tooltip'

function CrudStepper({
  versionName,
  firstStepValues,
  setFirstStepValues,
  handleChangeConnectionType,
  names,
  MenuProps,
  handleClick,
  handleChange,

  buildTool,
  codeError,
  setCodeError,
  ConnectionType,
  timeOptions,
  authOptions,
}) {
  const isPythonSelected = firstStepValues.programming_language === 'Python'
  const isJavaSelected = firstStepValues.programming_language === 'java'
  const isTargetSystemSelected = !!firstStepValues.target_system
  const isBuildtoolSelested = !!firstStepValues.build_tool
  const [generateCodeClicked, setGenerateCodeClicked] = React.useState(false)
  const [generateCodeClickedTool, setGenerateCodeClickedTool] =
    React.useState(false)
  const [selectedButton, setSelectedButton] = useState(null)
  const [selectButton, setselectButton] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showFields, setShowFields] = useState(false)
  const [showFieldsOf, setShowFieldsOf] = useState(false)
  const [selectedTargetSystem, setSelectedTargetSystem] = useState('')
  const [showNewSystemInput, setShowNewSystemInput] = useState(false)
  const [selectedSystem, setSelectedSystem] = useState('')
  const [newSystemName, setNewSystemName] = useState('')
  const [customSystem, setCustomSystem] = useState('')
  const handleButtonClick = (buttonOption) => {
    setSelectedButton(buttonOption)
  }

  const handleButtonClick1 = () => {
    setShowFields(!showFields)
  }

  const textFieldStyles = {
    boxShadow: '0px 4px 2px 0px rgba(0, 0, 0, 0.25)',
    width: '45%',
    borderRadius: '10px',
    height: 'auto',
    marginBottom: '1rem',
    marginRight: '1rem',
  }
  const inputLabelPropsStyles = {
    fontStyle: 'ubuntu',
    fontSize: '1.1rem',
    fontWeight: '500',
  }
  const inputLabelProps = { className: sharedStyles.aiInputLabel }

  const handleButtonClickYes = (buttonOptionyes) => {
    setselectButton(buttonOptionyes)
  }

  const handleChange1 = (event) => {
    handleChange(event)
    const { name, value } = event.target
    if (name === 'target_system') {
      setSelectedTargetSystem(value)
      setShowFieldsOf(value !== '+ new Target System')
      setShowNewSystemInput(true)
    }
    setSelectedSystem(value)
  }

  const handleProgrammingLanguageChange = (event) => {
    const { value } = event.target

    // Handle Java version selection
    if (value === 'java17') {
      setFirstStepValues({
        ...firstStepValues,
        programming_language: 'java',
        javaVersion: '17',
      })
    } else if (value === 'java21') {
      setFirstStepValues({
        ...firstStepValues,
        programming_language: 'java',
        javaVersion: '21',
      })
    } else {
      setFirstStepValues({
        ...firstStepValues,
        programming_language: value,
        javaVersion: '',
      })
    }
  }

  // const handleNewSystemNameChange = (event) => {
  //   setNewSystemName(event.target.value);
  // };

  const handleCustomSystemChange = (event) => {
    setCustomSystem(event.target.value)
  }

  const handleChangeclick = (event) => {
    handleChange(event)
    setFirstStepValues({
      ...firstStepValues,
      [event.target.name]: event.target.value,
    })
  }
  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  useEffect(() => {
    setSelectedButton('option1')
    setselectButton('option1')
  }, [])

  return (
    <div className={styles.step_two_section_crud}>
      <div>
        <span className={styles.step_three_header}>Uploaded schema file</span>
        <img alt='Back' src={Document} className={styles.backImage} />
      </div>
      <div className={styles.step_three_tile}>
        <div className={styles.sub_div}>File Name: </div>
        <div className={styles.sub_div_name_tm}>
          {' '}
          {firstStepValues.swaggerDocumentPath}
        </div>
      </div>
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
        {generateCodeClickedTool && !isBuildtoolSelested && (
          <Alert severity='warning'>
            <AlertTitle>Please select Build Tool.</AlertTitle>
          </Alert>
        )}
      </div>
      <div className={sharedStyles.aiWidthFull}>
        <div className={styles.drop_down_cont}>
          <TextField
            select
            className={sharedStyles.aiFieldShadow}
            name='target_db_type'
            value={firstStepValues.target_db_type}
            onChange={handleChange}
            label='Target DB Type'
            fullWidth
            sx={{ minWidth: '240px', maxWidth: '100%' }}
            InputLabelProps={inputLabelProps}
          >
            <MenuItem value='postgresql'>Postgres</MenuItem>
            <MenuItem value='mysql'>MySql</MenuItem>
            <MenuItem value='mongodb'>MongoDB</MenuItem>
            <MenuItem value='h2'>H2</MenuItem>
            <MenuItem value='elastic_search'>Elastic Search</MenuItem>
            <MenuItem value='oracle_db'>Oracle DB</MenuItem>
          </TextField>
        </div>
        <div className={sharedStyles.aiMt10}>
          <span className={styles.configHeader}>Data Source Configuration</span>
        </div>
        <div
          className={`${styles.drop_down_cont} ${sharedStyles.aiFlexBetween}`}
        >
          <TextField
            select
            name='connection_Type'
            value={firstStepValues.connection_Type}
            onChange={handleChangeConnectionType}
            label='Connection Type'
            variant='outlined'
            className={`${sharedStyles.aiFieldShadow} ${sharedStyles.aiWidth48} ${sharedStyles.aiHeight56}`}
            InputLabelProps={inputLabelProps}
          >
            <MenuItem value='RESTful'>
              <ListItemText primary='RESTful' />
            </MenuItem>
            <MenuItem value='websocket'>
              <ListItemText primary='Web Socket' />
            </MenuItem>
            <MenuItem value='GraphQL'>
              <ListItemText primary='GraphQL' />
            </MenuItem>
          </TextField>

          <TextField
            label='Url'
            name='data_source_url'
            value={firstStepValues.data_source_url}
            onChange={handleChange}
            InputLabelProps={inputLabelProps}
            className={`text-feild-mui ${sharedStyles.aiFieldShadow} ${sharedStyles.aiWidth48}`}
            variant='outlined'
          />
          <TextField
            label='Driver name'
            name='data_source_driver_name'
            value={firstStepValues.data_source_driver_name}
            onChange={handleChange}
            InputLabelProps={inputLabelProps}
            className={`text-feild-mui ${sharedStyles.aiFieldShadow} ${sharedStyles.aiWidth48}`}
            variant='outlined'
          />
        </div>
        <div
          className={`${styles.drop_down_cont} ${sharedStyles.aiFlexBetween}`}
        >
          <TextField
            label='Username'
            name='data_source_username'
            value={firstStepValues.data_source_username}
            onChange={handleChange}
            InputLabelProps={inputLabelProps}
            className={`text-feild-mui ${sharedStyles.aiFieldShadow} ${sharedStyles.aiWidth48}`}
            variant='outlined'
          />
          <TextField
            label='Password'
            name='data_source_password'
            type='password'
            value={firstStepValues.data_source_password}
            onChange={handleChange}
            InputLabelProps={inputLabelProps}
            className={`text-feild-mui ${sharedStyles.aiFieldShadow} ${sharedStyles.aiWidth48}`}
            variant='outlined'
          />
        </div>
        <div className={sharedStyles.aiMt10}>
          <span className={styles.configHeader}>Application Configuration</span>
        </div>
        <div
          className={`${styles.drop_down_cont} ${sharedStyles.aiFlexBetween}`}
        >
          <TextField
            select
            name='programming_language'
            value={
              firstStepValues.programming_language === 'java' &&
              firstStepValues.javaVersion === '17'
                ? 'java17'
                : firstStepValues.programming_language === 'java' &&
                  firstStepValues.javaVersion === '21'
                ? 'java21'
                : firstStepValues.programming_language
            }
            onChange={handleProgrammingLanguageChange}
            label='Programming Language'
            className={`${sharedStyles.aiFieldShadow} ${sharedStyles.aiWidth48}`}
            fullWidth
            InputLabelProps={inputLabelProps}
          >
            <MenuItem value='java17'>Java 17</MenuItem>
            <MenuItem value='java21'>Java 21</MenuItem>
            <MenuItem value='python'>Python</MenuItem>
            <MenuItem value='nodejs'>NodeJS 20</MenuItem>
          </TextField>
          <TextField
            select
            className={`${sharedStyles.aiFieldShadow} ${sharedStyles.aiWidth48}`}
            onChange={handleChange}
            name='build_tool'
            label='Build Tool'
            value={firstStepValues.build_tool}
            InputLabelProps={inputLabelProps}
          >
            <MenuItem value='gradle'>Gradle</MenuItem>
            <MenuItem value='maven'>Maven</MenuItem>
          </TextField>
          <TextField
            select
            className={`${sharedStyles.aiFieldShadow} ${sharedStyles.aiWidth48}`}
            onChange={handleChange}
            name='configuration'
            label='Configuration'
            value={firstStepValues.configuration}
            InputLabelProps={inputLabelProps}
          >
            <MenuItem value='yaml'>YAML</MenuItem>
            <MenuItem value='properties'>Properties</MenuItem>
          </TextField>
        </div>
      </div>
      {/* {showFieldsOf && (
        <React.Fragment>
        <div className={styles.sup_div_auth}>
          <Box
          sx={{ textAlign: 'center', fontSize:'25px', fontWeight:'600', textDecoration: 'underline',marginTop: '10px'}}>{selectedTargetSystem} Connector</Box>
        <TextField
            select
            name='Connection_Type'
            value={firstStepValues.Connection_Type}
            onChange={handleChange}
            label='Connection Type'
            fullWidth
            sx={{ minWidth: '240px', maxWidth: '270px' ,marginTop:'1rem',}}
            InputLabelProps={{
              style: {
                fontStyle: 'ubuntu',
                fontSize: '1.1rem',
                fontWeight: '500',
              },
            }}
          >
            {ConnectionType.map((name) => (
              <MenuItem key={name} value={name}>
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </TextField>
          <TextField
            sx={{ marginLeft: '1rem', minWidth: '380px', maxWidth: '40px',marginTop:'1rem', }}
            onChange={handleChange}
            label='Api Host'
            InputLabelProps={{
              style: {
                fontStyle: 'ubuntu',
                fontSize: '1.1rem',
                fontWeight: '500',
              },
            }}
          >
          </TextField>
      
       

        </div>
        </React.Fragment>
        )} */}

      <div className={styles.step_three_button_holder}>
        <button
          className={`${styles.buttom_container} ${
            !firstStepValues.target_db_type ||
            !firstStepValues.data_source_url ||
            !firstStepValues.data_source_driver_name ||
            !firstStepValues.data_source_username ||
            !firstStepValues.data_source_password ||
            !firstStepValues.programming_language ||
            !firstStepValues.build_tool
              ? styles.disable_button
              : ''
          }`}
          onClick={() => {
            setGenerateCodeClicked(true)
            setGenerateCodeClickedTool(true)
            if ((isTargetSystemSelected, isBuildtoolSelested)) {
              handleClick()
            }
          }}
          disabled={
            !firstStepValues.target_db_type ||
            !firstStepValues.data_source_url ||
            !firstStepValues.data_source_driver_name ||
            !firstStepValues.data_source_username ||
            !firstStepValues.data_source_password ||
            !firstStepValues.programming_language ||
            !firstStepValues.build_tool
          }
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

export default withStepOneValues(CrudStepper)
