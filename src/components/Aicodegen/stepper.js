// Stepper.js
import React, { useState, useEffect } from 'react'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import styles from './Aicodegen.module.css'
import sharedStyles from '../../aicodegen.module.css'
import Document from '../../assets/icons/Document.png'
import {
  useStepOneContext,
  withStepOneValues,
} from '../../context/firstStepContext.js'
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Button,
  Grid,
  IconButton,
  Box as MuiBox,
} from '@mui/material'
import TextField from '@mui/material/TextField'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import { Delete } from '@mui/icons-material'

function Stepper({
  firstStepValues,
  setFirstStepValues,
  handleTokenKeyValuePairChange,
  apiHostOptions,
  accessToken,
  pairs,
  setPairs,
  handleClick,
  handleChange,
  codeError,
  handleDateChange,
  ConnectionType,
  timeOptions,
  authOptions,
  handleAccessTokenChange,
  setSelectedButton,
  selectedButton,
  showSubscribeField,
  selectedDate,
  handleChangeConnectionType,
  coreIds,
  identityProvider,
  handleIdentityProviderChange,
  kafka,
  setKafka,
  handleKafkaChange,
}) {
  const isPythonSelected = firstStepValues.programming_language === 'python'
  const isTargetSystemSelected = !!firstStepValues.target_system
  const [generateCodeClicked, setGenerateCodeClicked] = React.useState(false)
  const [generateCodeClickedTool, setGenerateCodeClickedTool] =
    React.useState(false)

  const [showFields, setShowFields] = useState(false)
  const [showFieldsOf, setShowFieldsOf] = useState(false)
  const [selectButtonCache, setselectButtonCache] = useState('No')
  const [authorizer, setAuthorizer] = useState('yes')
  const [showAlert, setShowAlert] = useState(false)

  const handleAuthorizerChange = (event) => {
    setAuthorizer(event.target.value)
  }

  const handleKeyChange = (index, newKey) => {
    const newPairs = [...pairs]
    newPairs[index].key = newKey
    setPairs(newPairs)
  }

  const handleValueChange = (index, newValue) => {
    const newPairs = [...pairs]
    newPairs[index].value = newValue
    setPairs(newPairs)
  }

  const addPair = () => {
    setPairs([...pairs, { key: '', value: '' }])
  }

  const removePair = (index) => {
    const newPairs = pairs.filter((_, i) => i !== index)
    setPairs(newPairs)
  }

  // Dynamic token key-value pair handlers
  // Helper function to convert object to array format
  const convertTokenKeyValuePairToArray = (tokenKeyValuePair) => {
    if (!tokenKeyValuePair) return []
    if (Array.isArray(tokenKeyValuePair)) return tokenKeyValuePair
    // Convert object {username: "...", password: "..."} to array [{name: "username", value: "..."}, ...]
    return Object.entries(tokenKeyValuePair).map(([name, value]) => ({
      name,
      value,
    }))
  }

  const handleKeyValueChange = (index, key, newValue) => {
    const currentPairs = convertTokenKeyValuePairToArray(
      accessToken.tokenKeyValuePair
    )
    const updatedPairs = currentPairs.map((pair, i) =>
      i === index ? { ...pair, [key]: newValue } : pair
    )
    handleAccessTokenChange({
      target: {
        name: 'tokenKeyValuePair',
        value: updatedPairs,
      },
    })
  }

  const handleAddNewPair = () => {
    const currentPairs = convertTokenKeyValuePairToArray(
      accessToken.tokenKeyValuePair
    )
    const updatedPairs = [...currentPairs, { name: '', value: '' }]
    handleAccessTokenChange({
      target: {
        name: 'tokenKeyValuePair',
        value: updatedPairs,
      },
    })
  }

  const handleDeletePair = (index) => {
    const currentPairs = convertTokenKeyValuePairToArray(
      accessToken.tokenKeyValuePair
    )
    const updatedPairs = currentPairs.filter((_, i) => i !== index)
    handleAccessTokenChange({
      target: {
        name: 'tokenKeyValuePair',
        value: updatedPairs,
      },
    })
  }

  const handleButtonClick = (buttonOption) => {
    setSelectedButton(buttonOption)
  }

  const handleAuthClick = () => {
    if (accessToken?.authorization) {
      setShowAlert(true)
      setShowFields((prevShowFields) => !prevShowFields)
    } else {
      setShowFields((prevShowFields) => !prevShowFields)
    }
  }

  const handleButtonClickCache = (buttonOption) => {
    setselectButtonCache(buttonOption)
    handleChange({
      target: {
        name: 'secretConfigurationRequired',
        value: buttonOption === 'Yes',
      },
    })
  }

  const textFieldStyles = {
    boxShadow: '0px 4px 2px 0px rgba(0, 0, 0, 0.25)',

    borderRadius: '10px',

    marginBottom: '1rem',
  }
  const inputLabelPropsStyles = { className: sharedStyles.aiInputLabel }

  const handleChange1 = (event) => {
    handleChange(event)
    const { name, value } = event.target
    if (name === 'target_system') {
      setShowFieldsOf(value !== '+ new Target System')
    }
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

  const isGenerateButtonDisabled = () => {
    if (firstStepValues.target_system === 'Self') {
      return (
        !firstStepValues.programming_language ||
        (firstStepValues.programming_language !== 'nodejs' &&
          firstStepValues.programming_language !== 'python' &&
          !firstStepValues.build_tool) ||
        !firstStepValues.client ||
        !firstStepValues.target_system
      )
    }

    // Check if secret vault is required but fields are missing
    const isSecretVaultRequired = selectButtonCache === 'Yes'
    const isSecretVaultFieldsMissing =
      isSecretVaultRequired &&
      (!firstStepValues.secretConfigurationType ||
        !firstStepValues.secretConfigurationKey)

    return (
      !firstStepValues.programming_language ||
      (firstStepValues.programming_language !== 'nodejs' &&
        firstStepValues.programming_language !== 'python' &&
        !firstStepValues.build_tool) ||
      !firstStepValues.client ||
      !identityProvider.provider ||
      (firstStepValues.connection_Type !== 'kafka' &&
        !firstStepValues.target_system_apiHost) ||
      !firstStepValues.connection_Type ||
      !authorizer ||
      !firstStepValues.target_system ||
      isSecretVaultFieldsMissing
    )
  }

  return (
    <div className={styles.step_two_section}>
      <div className={styles.padding_warpper}>
        <div>
          <span className={styles.step_three_header}>Uploaded yaml file</span>
          <img alt='Back' src={Document} className={styles.backImage} />
        </div>
        <div className={styles.step_three_tile}>
          <div className={styles.sub_div}>File Name: </div>
          <div className={styles.sub_div_name_tm}>
            {' '}
            {firstStepValues.swaggerDocumentPath}
          </div>
        </div>
        <div className={styles.toggleButtonContainer}>
          <div className={styles.box_button}>
            <span className={styles.sub_div_name1}>Nature of Data Model:</span>
            <section>
              <Tooltip
                title='Request and response Data payload is propagated in its native format. Ex: JSON, XML..etc'
                arrow
              >
                <button
                  className={`${styles.Two_button_option1} ${
                    selectedButton === 'flexible' ? '' : styles.disable_button
                  }`}
                  onClick={() => handleButtonClick('flexible')}
                >
                  Flexible
                </button>
              </Tooltip>
              <Tooltip
                title='Request and response Data payload is marshalled into the underlined programming language specific DTOs'
                arrow
              >
                <button
                  className={`${styles.Two_button_option2} ${
                    selectedButton === 'strong' ? '' : styles.disable_button
                  }`}
                  onClick={() => handleButtonClick('strong')}
                >
                  Strong
                </button>
              </Tooltip>
            </section>
          </div>
        </div>
        <div className={styles.drop_down_cont}>
          <TextField
            select
            className={styles.textfieldStyles}
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
            sx={{ width: '100%' }}
            InputLabelProps={{
              style: {
                fontStyle: 'ubuntu',
                fontSize: '1.1rem',
                fontWeight: '500',
              },
            }}
          >
            <MenuItem value='java17'>Java 17</MenuItem>
            <MenuItem value='java21'>Java 21</MenuItem>
            <MenuItem value='python'>Python 3.5</MenuItem>
            <MenuItem value='nodejs'>NodeJS 20</MenuItem>
          </TextField>
          {firstStepValues.programming_language !== 'nodejs' &&
            firstStepValues.programming_language !== 'python' && (
              <TextField
                className={styles.textfieldStyles}
                select
                sx={{ width: '100%' }}
                onChange={handleChange}
                name='build_tool'
                label='Build Tool'
                value={firstStepValues.build_tool}
                InputLabelProps={{
                  style: {
                    fontStyle: 'ubuntu',
                    fontSize: '1.1rem',
                    fontWeight: '500',
                  },
                }}
              >
                <MenuItem value='gradle'>Gradle</MenuItem>
                <MenuItem value='maven'>Maven</MenuItem>
              </TextField>
            )}
          <Autocomplete
            className={styles.textfieldStyles}
            sx={{ width: '100%' }}
            freeSolo
            options={coreIds}
            getOptionLabel={(option) => option}
            value={firstStepValues.target_system}
            onChange={(event, newValue) => {
              handleChange1({
                target: { name: 'target_system', value: newValue },
              })
            }}
            onInputChange={(event, newValue) => {
              handleChange1({
                target: { name: 'target_system', value: newValue },
              })
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Target System to Integrate'
                InputLabelProps={{
                  style: {
                    fontStyle: 'ubuntu',
                    fontSize: '1.1rem',
                    fontWeight: '500',
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <MenuItem {...props} key={option} value={option}>
                <ListItemText primary={option} />
              </MenuItem>
            )}
          />

          <TextField
            className={styles.textfieldStyles}
            select
            name='client'
            value={firstStepValues.client}
            onChange={handleChange}
            label="Client's Dev Endpoint"
            sx={{ width: '100%' }}
            InputLabelProps={{
              style: {
                fontStyle: 'ubuntu',
                fontSize: '1.1rem',
                fontWeight: '500',
              },
            }}
          >
            <MenuItem value='generic'>Speedstack-Sandbox</MenuItem>
            <MenuItem value='celta'>Celta</MenuItem>
            <MenuItem disabled value='accenture'>
              Accenture
            </MenuItem>
          </TextField>
        </div>

        {showFieldsOf && (
          <React.Fragment>
            <div className={styles.sup_div_auth_top}>
              <MuiBox
                sx={{
                  textAlign: 'center',
                  fontSize: '18px',
                  fontWeight: '600',
                  textDecoration: 'underline',
                }}
              >
                {firstStepValues.target_system} "Auth n/z"
              </MuiBox>
              <div className={styles.box_button_secret}>
                <span className={styles.sub_div_name1}>
                  Is secret vault integration required?
                </span>
                <section>
                  <button
                    className={`${styles.Two_button_option3} ${
                      selectButtonCache === 'Yes' ? '' : styles.disable_button
                    }`}
                    onClick={() => handleButtonClickCache('Yes')}
                  >
                    Yes
                  </button>
                  <button
                    className={`${styles.Two_button_option4} ${
                      selectButtonCache === 'No' ? '' : styles.disable_button
                    }`}
                    onClick={() => handleButtonClickCache('No')}
                  >
                    No
                  </button>
                </section>
              </div>
              {selectButtonCache === 'Yes' && (
                <>
                  <TextField
                    className={styles.textfieldStyles}
                    select
                    name='secretConfigurationType'
                    value={firstStepValues.secretConfigurationType}
                    onChange={handleChange}
                    label='Secret Configuration Type'
                    sx={{ width: '100%' }}
                    InputLabelProps={{
                      style: {
                        fontStyle: 'ubuntu',
                        fontSize: '1.1rem',
                        fontWeight: '500',
                      },
                    }}
                  >
                    <MenuItem value='awsSecretManager'>
                      AWS Secret Manager
                    </MenuItem>
                    <MenuItem value='azureKeyVault'>Azure keyVault</MenuItem>
                  </TextField>
                  <TextField
                    className={styles.textfieldStyles}
                    name='secretConfigurationKey'
                    value={firstStepValues.secretConfigurationKey}
                    onChange={handleChange}
                    label='Secret Configuration Key'
                    sx={{ width: '100%', mt: 2 }}
                    InputLabelProps={{
                      style: {
                        fontStyle: 'ubuntu',
                        fontSize: '1.1rem',
                        fontWeight: '500',
                      },
                    }}
                  />
                </>
              )}
              <div className={styles.drop_down_cont}>
                <TextField
                  className={styles.textfieldStyles}
                  select
                  name='provider'
                  value={identityProvider.provider}
                  onChange={handleIdentityProviderChange}
                  label='Authentication ( Identity Provider)'
                  sx={{ width: '100%' }}
                  InputLabelProps={{
                    style: {
                      fontStyle: 'ubuntu',
                      fontSize: '1.1rem',
                      fontWeight: '500',
                    },
                  }}
                >
                  <MenuItem
                    value='azureAd'
                    disabled={firstStepValues.programming_language === 'nodejs'}
                  >
                    Azure AD
                  </MenuItem>
                  <MenuItem
                    value='keycloak'
                    disabled={firstStepValues.programming_language === 'nodejs'}
                  >
                    Keycloak
                  </MenuItem>
                  <MenuItem value='cognito'>Cognito</MenuItem>
                </TextField>
                {identityProvider.provider === 'azureAd' && (
                  <Grid item xs={12}>
                    <TextField
                      className={styles.textfieldStyles}
                      name='tenantId'
                      value={identityProvider.tenantId}
                      onChange={handleIdentityProviderChange}
                      label='Tenant ID'
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                )}

                {/* Keycloak Fields */}
                {identityProvider.provider === 'keycloak' && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        className={styles.textfieldStyles}
                        name='authServerUrl'
                        value={identityProvider.authServerUrl}
                        onChange={handleIdentityProviderChange}
                        label='Auth Server URL'
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        className={styles.textfieldStyles}
                        name='realm'
                        value={identityProvider.realm}
                        onChange={handleIdentityProviderChange}
                        label='Realm'
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        className={styles.textfieldStyles}
                        name='resource'
                        value={identityProvider.resource}
                        onChange={handleIdentityProviderChange}
                        label='Resource'
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  </>
                )}

                {/* Cognito Fields */}
                {identityProvider.provider === 'cognito' && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        className={styles.textfieldStyles}
                        name='userPoolId'
                        value={identityProvider.userPoolId}
                        onChange={handleIdentityProviderChange}
                        label='User Pool ID'
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        className={styles.textfieldStyles}
                        name='userPoolClientId'
                        value={identityProvider.userPoolClientId}
                        onChange={handleIdentityProviderChange}
                        label='User Pool Client ID'
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        className={styles.textfieldStyles}
                        name='jwksUri'
                        value={identityProvider.jwksUri}
                        onChange={handleIdentityProviderChange}
                        label='Token signing key URL'
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  </>
                )}
                <TextField
                  className={styles.textfieldStyles}
                  select
                  name='authorizer'
                  value={authorizer}
                  onChange={handleAuthorizerChange}
                  label='Authorizer'
                  sx={{ width: '100%' }}
                  InputLabelProps={{
                    style: {
                      fontStyle: 'ubuntu',
                      fontSize: '1.1rem',
                      fontWeight: '500',
                    },
                  }}
                >
                  <MenuItem value='yes'>
                    I want to use Speedstack lambda authorizer (
                    {identityProvider.provider})
                  </MenuItem>
                  <MenuItem value='no'>
                    I want to handle authorization myself at the Microservice
                    Level ({identityProvider.provider})
                  </MenuItem>
                </TextField>
              </div>

              {showFieldsOf && firstStepValues.target_system !== 'Self' && (
                <React.Fragment>
                  <div className={styles.sup_div_auth}>
                    <MuiBox
                      sx={{
                        textAlign: 'center',
                        fontSize: '18px',
                        fontWeight: '600',
                        textDecoration: 'underline',
                        marginTop: '10px',
                      }}
                    >
                      {firstStepValues.target_system} Connector
                    </MuiBox>
                    <div className={styles.drop_down_cont}>
                      <TextField
                        select
                        className={styles.textfieldStyles}
                        name='connection_Type'
                        value={firstStepValues.connection_Type}
                        onChange={handleChangeConnectionType}
                        label='Connection Type'
                        sx={{
                          width: '100%',
                          height: '56px',
                          maxHeight: '56px',
                        }}
                        InputLabelProps={{
                          style: {
                            fontStyle: 'ubuntu',
                            fontSize: '1.1rem',
                            fontWeight: '500',
                          },
                        }}
                      >
                        <MenuItem value='RESTful'>RESTful</MenuItem>
                        <MenuItem value='Web Socket'>Web Socket</MenuItem>
                        <MenuItem value='gRPC'>gRPC</MenuItem>
                        <MenuItem value='Streaming'>Streaming</MenuItem>
                        <MenuItem value='kafka'>
                          Async Messaging (kafka)
                        </MenuItem>
                      </TextField>
                      {firstStepValues.connection_Type === 'kafka' && (
                        <>
                          <TextField
                            className={styles.textfieldStyles}
                            select
                            name='duplex_type'
                            value={kafka.duplex_type}
                            onChange={handleKafkaChange}
                            label='Async Communication Type'
                            sx={{ width: '100%', maxHeight: '56px' }}
                            InputLabelProps={{
                              style: {
                                fontStyle: 'ubuntu',
                                fontSize: '1.1rem',
                                fontWeight: '500',
                              },
                            }}
                          >
                            <MenuItem value='full_duplex'>Full Duplex</MenuItem>
                            <MenuItem value='half_duplex'>Half Duplex</MenuItem>
                          </TextField>

                          <TextField
                            className={styles.textfieldStyles}
                            sx={{ width: '100%' }}
                            name='kafka_broker_url'
                            onChange={handleKafkaChange}
                            value={kafka.kafka_broker_url || ''}
                            label='Kafka End Point URL'
                            InputLabelProps={{
                              style: {
                                fontStyle: 'ubuntu',
                                fontSize: '1.1rem',
                                fontWeight: '500',
                              },
                            }}
                          />
                        </>
                      )}

                      {(kafka.duplex_type === 'half_duplex' ||
                        kafka.duplex_type === 'full_duplex') && (
                        <TextField
                          className={styles.textfieldStyles}
                          sx={{ width: '100%' }}
                          name='request_topic'
                          value={kafka.request_topic || ''}
                          onChange={handleKafkaChange}
                          label='Topic Name'
                          InputLabelProps={{
                            style: {
                              fontStyle: 'ubuntu',
                              fontSize: '1.1rem',
                              fontWeight: '500',
                            },
                          }}
                        />
                      )}

                      {kafka.duplex_type === 'full_duplex' && (
                        <TextField
                          className={styles.textfieldStyles}
                          select
                          name='responseHandlingType'
                          value={kafka.responseHandlingType || ''}
                          onChange={handleKafkaChange}
                          label='How do you want to handle response?'
                          sx={{ width: '100%' }}
                          InputLabelProps={{
                            style: {
                              fontStyle: 'ubuntu',
                              fontSize: '1.1rem',
                              fontWeight: '500',
                            },
                          }}
                        >
                          <MenuItem value='webhook'>Webhook</MenuItem>
                          <MenuItem value='requestor_responder'>
                            Requestor is Consumer & Responder is Producer
                          </MenuItem>
                        </TextField>
                      )}
                      {kafka.responseHandlingType === 'webhook' && (
                        <TextField
                          className={styles.textfieldStyles}
                          name='webhook_url'
                          value={kafka.webhook_url || ''}
                          onChange={handleKafkaChange}
                          label='Webhook URL'
                          sx={{ width: '100%' }}
                          InputLabelProps={{
                            style: {
                              fontStyle: 'ubuntu',
                              fontSize: '1.1rem',
                              fontWeight: '500',
                            },
                          }}
                        />
                      )}

                      {kafka.responseHandlingType === 'requestor_responder' && (
                        <TextField
                          className={styles.textfieldStyles}
                          name='response_topic'
                          value={kafka.response_topic || ''}
                          onChange={handleKafkaChange}
                          label='Response Topic'
                          sx={{ width: '100%' }}
                          InputLabelProps={{
                            style: {
                              fontStyle: 'ubuntu',
                              fontSize: '1.1rem',
                              fontWeight: '500',
                            },
                          }}
                        />
                      )}
                      {(kafka.duplex_type === 'full_duplex' ||
                        kafka.duplex_type === 'half_duplex') && (
                        <>
                          <TextField
                            className={styles.textfieldStyles}
                            sx={{ width: '100%' }}
                            name='aws_secret_key'
                            onChange={handleKafkaChange}
                            value={kafka.aws_secret_key || ''}
                            label='AWS Secret Key'
                            InputLabelProps={{
                              style: {
                                fontStyle: 'ubuntu',
                                fontSize: '1.1rem',
                                fontWeight: '500',
                              },
                            }}
                          />

                          <TextField
                            className={styles.textfieldStyles}
                            sx={{ width: '100%' }}
                            name='aws_access_key'
                            onChange={handleKafkaChange}
                            value={kafka.aws_access_key || ''}
                            label='AWS Access Key'
                            InputLabelProps={{
                              style: {
                                fontStyle: 'ubuntu',
                                fontSize: '1.1rem',
                                fontWeight: '500',
                              },
                            }}
                          />
                        </>
                      )}

                      {firstStepValues.connection_Type !== 'kafka' && (
                        <Autocomplete
                          className={styles.textfieldStyles}
                          sx={{ width: '100%' }}
                          freeSolo
                          options={apiHostOptions}
                          getOptionLabel={(option) => option}
                          value={firstStepValues.target_system_apiHost}
                          onChange={(_, newValue) => {
                            handleChange({
                              target: {
                                name: 'target_system_apiHost',
                                value: newValue,
                              },
                            })
                          }}
                          onInputChange={(_, newInputValue) => {
                            handleChange({
                              target: {
                                name: 'target_system_apiHost',
                                value: newInputValue,
                              },
                            })
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              label='Api Host'
                              sx={{
                                width: '100%',
                              }}
                              InputLabelProps={{
                                style: {
                                  fontStyle: 'ubuntu',
                                  fontSize: '1.1rem',
                                  fontWeight: '500',
                                },
                              }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <MenuItem {...props} key={option} value={option}>
                              <ListItemText primary={option} />
                            </MenuItem>
                          )}
                        />
                      )}
                    </div>
                    {showSubscribeField && (
                      <MuiBox
                        sx={{
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'center',
                          marginTop: '1rem',
                        }}
                      >
                        <TextField
                          sx={{
                            width: '100%',
                          }}
                          name='subscribeToTopic'
                          onChange={handleChange}
                          label='Subscribe To Topic'
                          InputLabelProps={{
                            style: {
                              fontStyle: 'ubuntu',
                              fontSize: '1.1rem',
                              fontWeight: '500',
                            },
                          }}
                        />
                        <TextField
                          sx={{
                            width: '100%',
                          }}
                          name='streaming_endpoint'
                          onChange={handleChange}
                          value={firstStepValues.streaming_endpoint}
                          label='Streaming API endpoint'
                          InputLabelProps={{
                            style: {
                              fontStyle: 'ubuntu',
                              fontSize: '1.1rem',
                              fontWeight: '500',
                            },
                          }}
                        />
                      </MuiBox>
                    )}

                    <div className={styles.auth_container}>
                      <Button
                        onClick={handleAuthClick}
                        sx={{
                          marginLeft: '1rem',
                          minWidth: '200px',
                          maxWidth: '240px',
                          marginTop: '1rem',
                          textDecoration: 'underline',
                          textTransform: 'none',
                          color: '#3EA2FF',
                        }}
                      >
                        Configure Auth Token
                      </Button>
                    </div>
                    <div className={styles.step_five_section}>
                      {showAlert && (
                        <Alert
                          severity='warning'
                          className={styles.setp_gap_section}
                        >
                          <AlertTitle>
                            A token is already configured. If you make any
                            changes, it will replace the token for the entire
                            target system.
                          </AlertTitle>
                        </Alert>
                      )}
                    </div>
                    {showFields && (
                      <div className={styles.sub_div_auth}>
                        <TextField
                          label='Access Token Variant'
                          name='accessTokenVariant'
                          InputLabelProps={inputLabelPropsStyles}
                          variant='outlined'
                          sx={textFieldStyles}
                          value={accessToken?.accessTokenVariant}
                          select
                          fullWidth
                          onChange={handleAccessTokenChange}
                        >
                          <MenuItem value='static'>Static</MenuItem>
                          <MenuItem value='dynamic'>Dynamic</MenuItem>
                          <MenuItem value='withCredentials'>
                            With Credentials
                          </MenuItem>
                        </TextField>
                      </div>
                    )}
                    {showFields &&
                      accessToken?.accessTokenVariant === 'static' && (
                        <div className={styles.dynamic_container}>
                          {' '}
                          <Autocomplete
                            freeSolo
                            fullWidth
                            className={styles.dynamic_fields}
                            options={authOptions}
                            value={accessToken?.tokenType || ''}
                            onInputChange={(event, newInputValue) => {
                              handleAccessTokenChange({
                                target: {
                                  name: 'tokenType',
                                  value: newInputValue,
                                },
                              })
                            }}
                            onChange={(event, newValue) => {
                              handleAccessTokenChange({
                                target: {
                                  name: 'tokenType',
                                  value: newValue || '',
                                },
                              })
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label='Token Type'
                                name='tokenType'
                                InputLabelProps={inputLabelPropsStyles}
                                variant='outlined'
                                sx={textFieldStyles}
                              />
                            )}
                          />
                          <TextField
                            fullWidth
                            sx={textFieldStyles}
                            InputLabelProps={inputLabelPropsStyles}
                            label='Token Header Key'
                            name='tokenHeaderKey'
                            value={accessToken?.tokenHeaderKey}
                            onChange={handleAccessTokenChange}
                          />
                          <TextField
                            fullWidth
                            sx={textFieldStyles}
                            InputLabelProps={inputLabelPropsStyles}
                            label='Token'
                            name='authorization'
                            value={accessToken?.authorization}
                            onChange={handleAccessTokenChange}
                          />
                          <Typography
                            sx={{
                              fontFamily: 'Ubuntu, sans-serif',
                              fontWeight: '500',
                              fontSize: '20px',
                              color: '#1C242C',
                            }}
                            gutterBottom
                          >
                            Valid Upto :
                          </Typography>
                          <DatePicker
                            sx={{ minHeight: '40px' }}
                            variant='outlined'
                            fullWidth
                            placeholderText='Valid Until'
                            name='validUpto'
                            selected={selectedDate}
                            onChange={handleDateChange}
                            showTimeSelect
                            timeFormat='HH:mm'
                            timeIntervals={15}
                            dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                            timeCaption='Time'
                            value={accessToken?.validUpto || ''}
                          />
                        </div>
                      )}
                    {showFields &&
                      accessToken?.accessTokenVariant === 'dynamic' && (
                        <>
                          <div className={styles.headers_heading_container}>
                            <button
                              type='button'
                              className={`${styles.buttom_container} ${sharedStyles.aiMb8}`}
                              onClick={handleAddNewPair}
                            >
                              <AddIcon />
                              New token Pair
                            </button>
                          </div>

                          <div className={styles.dynamic_container}>
                            {/* Key-Value Pairs Section */}

                            {/* Dynamic Key-Value Pairs */}
                            {convertTokenKeyValuePairToArray(
                              accessToken.tokenKeyValuePair
                            ).map((pair, index) => (
                              <MuiBox
                                key={index}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                  mb: 2,
                                  width: '100%',
                                }}
                              >
                                <TextField
                                  fullWidth
                                  label='Key'
                                  value={pair.name || ''}
                                  onChange={(e) =>
                                    handleKeyValueChange(
                                      index,
                                      'name',
                                      e.target.value
                                    )
                                  }
                                  InputLabelProps={inputLabelPropsStyles}
                                  sx={textFieldStyles}
                                />
                                <TextField
                                  fullWidth
                                  label='Value'
                                  value={pair.value || ''}
                                  onChange={(e) =>
                                    handleKeyValueChange(
                                      index,
                                      'value',
                                      e.target.value
                                    )
                                  }
                                  InputLabelProps={inputLabelPropsStyles}
                                  sx={textFieldStyles}
                                />
                                <IconButton
                                  color='error'
                                  onClick={() => handleDeletePair(index)}
                                  aria-label='delete'
                                >
                                  <Delete />
                                </IconButton>
                              </MuiBox>
                            ))}

                            {/* Existing Dynamic Token Fields */}
                            <TextField
                              fullWidth={true}
                              className={styles.dynamic_fields}
                              label='Token Cached?'
                              name='isTokenCached'
                              InputLabelProps={inputLabelPropsStyles}
                              variant='outlined'
                              sx={textFieldStyles}
                              value={
                                accessToken.isTokenCached === true
                                  ? 'Yes'
                                  : 'No'
                              }
                              select
                              onChange={(e) =>
                                handleAccessTokenChange({
                                  target: {
                                    name: 'isTokenCached',
                                    value: e.target.value === 'Yes',
                                  },
                                })
                              }
                            >
                              <MenuItem value='Yes'>Yes</MenuItem>
                              <MenuItem value='No'>No</MenuItem>
                            </TextField>
                            <TextField
                              fullWidth={true}
                              className={styles.dynamic_fields}
                              label='WWWUrlEncoding Required?'
                              name='isWWWUrlEncodingRequired'
                              InputLabelProps={inputLabelPropsStyles}
                              variant='outlined'
                              sx={textFieldStyles}
                              value={
                                accessToken.isWWWUrlEncodingRequired === true
                                  ? 'Yes'
                                  : 'No'
                              }
                              select
                              onChange={(e) =>
                                handleAccessTokenChange({
                                  target: {
                                    name: 'isWWWUrlEncodingRequired',
                                    value: e.target.value === 'Yes',
                                  },
                                })
                              }
                            >
                              <MenuItem value='Yes'>Yes</MenuItem>
                              <MenuItem value='No'>No</MenuItem>
                            </TextField>
                            <TextField
                              className={styles.dynamic_fields}
                              fullWidth={true}
                              sx={textFieldStyles}
                              InputLabelProps={inputLabelPropsStyles}
                              label='URL'
                              name='accessTokenEndpointUrl'
                              value={accessToken.accessTokenEndpointUrl || ''}
                              onChange={handleAccessTokenChange}
                            />
                            <Autocomplete
                              freeSolo
                              fullWidth
                              className={styles.dynamic_fields}
                              options={authOptions}
                              value={accessToken?.tokenType || ''}
                              onInputChange={(event, newInputValue) => {
                                handleAccessTokenChange({
                                  target: {
                                    name: 'tokenType',
                                    value: newInputValue,
                                  },
                                })
                              }}
                              onChange={(event, newValue) => {
                                handleAccessTokenChange({
                                  target: {
                                    name: 'tokenType',
                                    value: newValue || '',
                                  },
                                })
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='Token Type'
                                  name='tokenType'
                                  InputLabelProps={inputLabelPropsStyles}
                                  variant='outlined'
                                  sx={textFieldStyles}
                                />
                              )}
                            />
                            <TextField
                              fullWidth
                              sx={textFieldStyles}
                              InputLabelProps={inputLabelPropsStyles}
                              label='Token Header Key'
                              name='tokenHeaderKey'
                              value={accessToken?.tokenHeaderKey}
                              onChange={handleAccessTokenChange}
                            />
                            <TextField
                              fullWidth={true}
                              className={styles.dynamic_fields}
                              label='Token Validity'
                              name='cronExpression'
                              InputLabelProps={inputLabelPropsStyles}
                              variant='outlined'
                              sx={textFieldStyles}
                              value={accessToken.cronExpression || ''}
                              select
                              onChange={handleAccessTokenChange}
                            >
                              <MenuItem value='*/30 * * * * ?'>
                                30 minutes
                              </MenuItem>
                              <MenuItem value='*/60 * * * * ?'>1 hour</MenuItem>
                              <MenuItem value='0 0 */5 * * ?'>5 hours</MenuItem>
                              <MenuItem value='0 0 */6 * * ?'>6 hours</MenuItem>
                              <MenuItem value='0 0 */12 * * ?'>
                                12 hours
                              </MenuItem>
                              <MenuItem value='0 0 0 */1 * ?'>1 day</MenuItem>
                              <MenuItem value='0 0 0 */30 * ?'>
                                30 days
                              </MenuItem>
                            </TextField>
                          </div>
                        </>
                      )}
                    {showFields &&
                      accessToken?.accessTokenVariant === 'withCredentials' && (
                        <div className={styles.dynamic_container}>
                          <div className={styles.add_key_container}>
                            {' '}
                            <button
                              type='button'
                              className={`${styles.buttom_container} ${sharedStyles.aiMr10}`}
                              onClick={addPair}
                            >
                              Add Pair
                            </button>
                          </div>
                          <TextField
                            fullWidth={true}
                            className={styles.dynamic_fields}
                            label='Token Cached?'
                            name='isTokenCached'
                            InputLabelProps={inputLabelPropsStyles}
                            variant='outlined'
                            sx={textFieldStyles}
                            value={
                              accessToken.isTokenCached !== undefined
                                ? accessToken.isTokenCached
                                : ''
                            }
                            select
                            onChange={handleAccessTokenChange}
                          >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                          </TextField>
                          <TextField
                            fullWidth={true}
                            className={styles.dynamic_fields}
                            label='Is WWWUrlEncoding Required?'
                            name='isWWWUrlEncodingRequired'
                            InputLabelProps={inputLabelPropsStyles}
                            variant='outlined'
                            sx={textFieldStyles}
                            value={
                              accessToken.isWWWUrlEncodingRequired !== undefined
                                ? accessToken.isWWWUrlEncodingRequired
                                : ''
                            }
                            select
                            onChange={handleAccessTokenChange}
                          >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                          </TextField>
                          <Autocomplete
                            freeSolo
                            fullWidth
                            className={styles.dynamic_fields}
                            options={authOptions}
                            value={accessToken?.tokenType || ''}
                            onInputChange={(event, newInputValue) => {
                              handleAccessTokenChange({
                                target: {
                                  name: 'tokenType',
                                  value: newInputValue,
                                },
                              })
                            }}
                            onChange={(event, newValue) => {
                              handleAccessTokenChange({
                                target: {
                                  name: 'tokenType',
                                  value: newValue || '',
                                },
                              })
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label='Token Type'
                                name='tokenType'
                                InputLabelProps={inputLabelPropsStyles}
                                variant='outlined'
                                sx={textFieldStyles}
                              />
                            )}
                          />

                          <TextField
                            className={styles.dynamic_fields}
                            fullWidth={true}
                            sx={textFieldStyles}
                            InputLabelProps={inputLabelPropsStyles}
                            label='URL'
                            value={accessToken.accessTokenEndpointUrl || ''}
                            name='accessTokenEndpointUrl'
                            onChange={handleAccessTokenChange}
                          />
                          <TextField
                            fullWidth={true}
                            className={styles.dynamic_fields}
                            label='Token Validity'
                            name='cronExpression'
                            InputLabelProps={inputLabelPropsStyles}
                            variant='outlined'
                            sx={textFieldStyles}
                            value={accessToken.cronExpression || ''}
                            select
                            onChange={handleAccessTokenChange}
                          >
                            <MenuItem value='*/30 * * * * ?'>
                              30 minutes
                            </MenuItem>
                            <MenuItem value='*/59 * * * * ?'>1 hour</MenuItem>
                            <MenuItem value='0 0 */5 * * ?'>5 hours</MenuItem>
                            <MenuItem value='0 0 */6 * * ?'>6 hours</MenuItem>
                            <MenuItem value='0 0 */12 * * ?'>12 hours</MenuItem>
                            <MenuItem value='0 0 0 */1 * ?'>1 day</MenuItem>
                            <MenuItem value='0 0 0 */30 * ?'>30 days</MenuItem>
                          </TextField>
                          {pairs.map((pair, index) => (
                            <div className={styles.key_container}>
                              <TextField
                                className={styles.dynamic_fields}
                                fullWidth={true}
                                sx={textFieldStyles}
                                InputLabelProps={inputLabelPropsStyles}
                                label='Key'
                                value={pair.key}
                                onChange={(e) =>
                                  handleKeyChange(index, e.target.value)
                                }
                                name='key'
                              />
                              <TextField
                                className={styles.dynamic_fields}
                                fullWidth={true}
                                label='Value'
                                name='value'
                                InputLabelProps={inputLabelPropsStyles}
                                variant='outlined'
                                sx={textFieldStyles}
                                value={pair.value}
                                onChange={(e) =>
                                  handleValueChange(index, e.target.value)
                                }
                              />
                              <button
                                type='button'
                                className={styles.buttom_container}
                                onClick={() => removePair(index)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        )}
      </div>

      <div className={styles.padding_warpper}>
        <div className={styles.step_five_section}>
          {authorizer === 'no' && (
            <Alert severity='warning' className={styles.setp_gap_section}>
              <AlertTitle> This feature is coming soon.</AlertTitle>
            </Alert>
          )}
        </div>

        <div className={styles.step_five_section}>
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
          <Alert severity='success' className={styles.setp_gap_section}>
            <AlertTitle sx={{ marginBottom: '0px' }}>
              All the Speedstack configurations and transformations are cached.
            </AlertTitle>
          </Alert>
        </div>
        <div className={styles.step_three_button_holder}>
          <button
            disabled={isGenerateButtonDisabled()}
            className={`${styles.buttom_container} ${
              !isGenerateButtonDisabled() ? '' : styles.disable_button
            }`}
            onClick={() => {
              setGenerateCodeClicked(true)
              setGenerateCodeClickedTool(true)
              if (isTargetSystemSelected) {
                handleClick()
              }
            }}
          >
            Generate Code
            <img
              src='https://fincuro.cdn.modyo.com/uploads/4bc7635a-cbea-4da6-ba7d-493c6f1cc15b/original/Generate_white.svg'
              alt='generate'
              className={styles.generateIcon}
            />
          </button>
          <button className={styles.buttom_container} onClick={handleClick}>
            Explore
            <img
              src='https://fincuro.cdn.modyo.com/uploads/2cd441c1-ec98-4c0e-9bcd-459654430b65/original/Group_1261153983.svg'
              alt='explore'
              className={styles.generateIcon}
            />
          </button>
          <button className={styles.buttom_container} onClick={handleClick}>
            Share{' '}
            <img
              src='https://fincuro.cdn.modyo.com/uploads/a8024a4c-34b1-4d99-8cd5-08fbf4e94b47/original/Group_1261153984.svg'
              alt='explore'
              className={styles.generateIcon}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default withStepOneValues(Stepper)
