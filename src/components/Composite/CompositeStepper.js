// Stepper.js
import React, { useState, useEffect } from 'react'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import styles from '../../components/Aicodegen/Aicodegen.module.css'
import sharedStyles from '../../aicodegen.module.css'
import Document from '../../assets/icons/Document.png'
import {
  useStepOneContext,
  withStepOneValues,
} from '../../context/firstStepContext.js'
import { Alert, AlertTitle, Autocomplete, Button, Grid } from '@mui/material'
import TextField from '@mui/material/TextField'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'


function CompositeStepper({
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
}) {
  const isPythonSelected = firstStepValues.programming_language === 'python'
  const isTargetSystemSelected = !!firstStepValues.target_system
  const [generateCodeClicked, setGenerateCodeClicked] = React.useState(false)
  const [generateCodeClickedTool, setGenerateCodeClickedTool] =
    React.useState(false)

  const [showFields, setShowFields] = useState(false)
  const [showFieldsOf, setShowFieldsOf] = useState(false)
  const [selectButtonCache, setselectButtonCache] = useState('Yes')
  const [authorizer, setAuthorizer] = useState('')
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
  }

  const textFieldStyles = {
    boxShadow: '0px 4px 2px 0px rgba(0, 0, 0, 0.25)',

    borderRadius: '10px',
    height: 'auto',
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
  const isGenerateButtonDisabled = () => {
    return (
      !firstStepValues.programming_language ||
      (firstStepValues.programming_language !== 'nodejs' &&
        !firstStepValues.build_tool) ||
      !firstStepValues.client ||
      firstStepValues.secretConfigurationRequired === null ||
      !identityProvider.provider ||
      !firstStepValues.target_system_apiHost ||
      !firstStepValues.connection_Type ||
      !authorizer ||
      !firstStepValues.target_system
    )
  }

  return (
    <>
      <div className={styles.step_two_section_composite}>
        <Accordion
          sx={{
            border: '1px solid #BBBBBB',
            borderRadius: '20px !important',
            boxShadow: '0px 4px 4px 0px #00000040',
            marginBottom: '1rem',
            width: '100%',
          }}
        >
          <AccordionSummary
            expandIcon={
              <img
                src='https://fincuro.cdn.modyo.com/uploads/8e499487-2d90-4a08-8be6-4313ed401e64/original/Line_504.svg'
                alt='Expand'
                className={sharedStyles.aiAccordionIcon}
              />
            }
            aria-controls='panel1-content'
            id='panel1-header'
          >
            <Typography
              component='span'
              sx={{
                fontFamily: 'Ubuntu',
                fontWeight: 500,
                fontSize: '22px',
              }}
            >
              Application Configuration
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={styles.step_two_section_composite}>
              <div className={styles.padding_warpper}>
                <div>
                  <span className={styles.step_three_header}>
                    Uploaded yaml file
                  </span>
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
                    <span className={styles.sub_div_name1}>
                      Nature of Data Model:
                    </span>
                    <section>
                      <button
                        className={`${styles.Two_button_option1} ${
                          selectedButton === 'flexible'
                            ? ''
                            : styles.disable_button
                        }`}
                        onClick={() => handleButtonClick('flexible')}
                      >
                        Flexible
                      </button>
                      <button
                        className={`${styles.Two_button_option2} ${
                          selectedButton === 'strong'
                            ? ''
                            : styles.disable_button
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
                        className={`${styles.Two_button_option3} ${
                          selectButtonCache === 'Yes'
                            ? ''
                            : styles.disable_button
                        }`}
                        onClick={() => handleButtonClickCache('Yes')}
                      >
                        Yes
                      </button>
                      <button
                        className={`${styles.Two_button_option4} ${
                          selectButtonCache === 'No'
                            ? ''
                            : styles.disable_button
                        }`}
                        onClick={() => handleButtonClickCache('No')}
                      >
                        No
                      </button>
                    </section>
                  </div>
                </div>
                <div className={styles.drop_down_cont}>
                  <TextField
                    select
                    className={styles.textfieldStyles}
                    name='programming_language'
                    value={firstStepValues.programming_language}
                    onChange={handleChange}
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
                    <MenuItem value='java'>Java 17</MenuItem>
                    <MenuItem disabled value='python'>
                      Python 3.5
                    </MenuItem>
                    <MenuItem value='nodejs'>NodeJS 20</MenuItem>
                  </TextField>
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
                        label='Target System'
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
                  <TextField
                    className={styles.textfieldStyles}
                    select
                    name='client'
                    value={firstStepValues.client}
                    onChange={handleChange}
                    label='Client'
                    sx={{ width: '100%' }}
                    InputLabelProps={{
                      style: {
                        fontStyle: 'ubuntu',
                        fontSize: '1.1rem',
                        fontWeight: '500',
                      },
                    }}
                  >
                    <MenuItem value='generic'>Sandbox</MenuItem>
                    <MenuItem value='celta'>Celta</MenuItem>
                    <MenuItem disabled value='accenture'>
                      Accenture
                    </MenuItem>
                  </TextField>
                </div>

                {showFieldsOf && (
                  <React.Fragment>
                    <div className={styles.sup_div_auth_top}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          fontSize: '18px',
                          fontWeight: '600',
                          textDecoration: 'underline',
                          marginTop: '10px',
                        }}
                      >
                        {firstStepValues.target_system} "Auth n/z"
                      </Box>
                      <div className={styles.drop_down_cont}>
                        <TextField
                          className={styles.textfieldStyles}
                          select
                          name='secretConfigurationRequired'
                          value={firstStepValues.secretConfigurationRequired}
                          onChange={handleChange}
                          label='Secret Configuration Required'
                          sx={{ width: '100%' }}
                          InputLabelProps={{
                            style: {
                              fontStyle: 'ubuntu',
                              fontSize: '1.1rem',
                              fontWeight: '500',
                            },
                          }}
                        >
                          <MenuItem value={true}>Yes</MenuItem>
                          <MenuItem value={false}>No</MenuItem>
                        </TextField>
                        {firstStepValues.secretConfigurationRequired ===
                          true && (
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
                            <MenuItem value='azureKeyVault'>
                              Azure keyVault
                            </MenuItem>
                          </TextField>
                        )}
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
                            disabled={
                              firstStepValues.programming_language === 'nodejs'
                            }
                          >
                            Azure AD
                          </MenuItem>
                          <MenuItem
                            value='keycloak'
                            disabled={
                              firstStepValues.programming_language === 'nodejs'
                            }
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
                            Lambda Authorizer from API Gateway (
                            {identityProvider.provider})
                          </MenuItem>
                          <MenuItem value='no'>
                            Microservice level ({identityProvider.provider})
                          </MenuItem>
                        </TextField>
                      </div>
                      {showFieldsOf &&
                        firstStepValues.target_system !== 'Self' && (
                          <React.Fragment>
                            <div className={styles.sup_div_auth}>
                              <Box
                                sx={{
                                  textAlign: 'center',
                                  fontSize: '18px',
                                  fontWeight: '600',
                                  textDecoration: 'underline',
                                  marginTop: '10px',
                                }}
                              >
                                {firstStepValues.target_system} Connector
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  marginTop: '1rem',
                                  gap: '1rem',
                                }}
                              >
                                <TextField
                                  select
                                  className={styles.textfieldStyles}
                                  name='connection_Type'
                                  value={firstStepValues.connection_Type}
                                  onChange={handleChangeConnectionType}
                                  label='Connection Type'
                                  sx={{ width: '50%' }}
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

                                <Autocomplete
                                  className={styles.textfieldStyles}
                                  sx={{ width: '50%' }}
                                  freeSolo
                                  options={apiHostOptions}
                                  getOptionLabel={(option) => option}
                                  value={firstStepValues.target_system_apiHost}
                                  onChange={(event, newValue) => {
                                    handleChange({
                                      target: {
                                        name: 'target_system_apiHost',
                                        value: newValue,
                                      },
                                    })
                                  }}
                                  onInputChange={(event, newInputValue) => {
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
                                    <MenuItem
                                      {...props}
                                      key={option}
                                      value={option}
                                    >
                                      <ListItemText primary={option} />
                                    </MenuItem>
                                  )}
                                />
                              </Box>
                              {showSubscribeField && (
                                <Box
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
                                    name='target_system_apiHost'
                                    onChange={handleChange}
                                    value={
                                      firstStepValues.target_system_apiHost
                                    }
                                    label='Streaming API endpoint'
                                    InputLabelProps={{
                                      style: {
                                        fontStyle: 'ubuntu',
                                        fontSize: '1.1rem',
                                        fontWeight: '500',
                                      },
                                    }}
                                  />
                                </Box>
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
                                      A token is already configured. If you make
                                      any changes, it will replace the token for
                                      the entire target system.
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
                                accessToken?.accessTokenVariant ===
                                  'static' && (
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
                                          InputLabelProps={
                                            inputLabelPropsStyles
                                          }
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
                                accessToken?.accessTokenVariant ===
                                  'dynamic' && (
                                  <div className={styles.dynamic_container}>
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
                                        accessToken.isWWWUrlEncodingRequired !==
                                        undefined
                                          ? accessToken.isWWWUrlEncodingRequired
                                          : ''
                                      }
                                      select
                                      onChange={handleAccessTokenChange}
                                    >
                                      <MenuItem value={true}>Yes</MenuItem>
                                      <MenuItem value={false}>No</MenuItem>
                                    </TextField>
                                    <TextField
                                      className={styles.dynamic_fields}
                                      fullWidth={true}
                                      sx={textFieldStyles}
                                      InputLabelProps={inputLabelPropsStyles}
                                      label='URL'
                                      value={
                                        accessToken.accessTokenEndpointUrl || ''
                                      }
                                      name='accessTokenEndpointUrl'
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
                                          InputLabelProps={
                                            inputLabelPropsStyles
                                          }
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
                                      label='Client ID'
                                      name='client_id'
                                      value={
                                        accessToken.tokenKeyValuePair
                                          ?.client_id || ''
                                      }
                                      onChange={handleTokenKeyValuePairChange}
                                    />
                                    <TextField
                                      className={styles.dynamic_fields}
                                      fullWidth={true}
                                      sx={textFieldStyles}
                                      InputLabelProps={inputLabelPropsStyles}
                                      label='Client Secret'
                                      name='client_secret'
                                      value={
                                        accessToken.tokenKeyValuePair
                                          ?.client_secret || ''
                                      }
                                      onChange={handleTokenKeyValuePairChange}
                                    />
                                    <TextField
                                      className={styles.dynamic_fields}
                                      fullWidth={true}
                                      sx={textFieldStyles}
                                      InputLabelProps={inputLabelPropsStyles}
                                      label='Authorization grant type'
                                      name='grant_type'
                                      value={
                                        accessToken.tokenKeyValuePair
                                          ?.grant_type || ''
                                      }
                                      onChange={handleTokenKeyValuePairChange}
                                    />
                                    <TextField
                                      className={styles.dynamic_fields}
                                      fullWidth={true}
                                      sx={textFieldStyles}
                                      InputLabelProps={inputLabelPropsStyles}
                                      label='Scope'
                                      name='resource'
                                      value={
                                        accessToken.tokenKeyValuePair
                                          ?.resource || ''
                                      }
                                      onChange={handleTokenKeyValuePairChange}
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
                                      <MenuItem value='*/59 * * * * ?'>
                                        1 hour
                                      </MenuItem>
                                      <MenuItem value='0 0 */5 * * ?'>
                                        5 hours
                                      </MenuItem>
                                      <MenuItem value='0 0 */6 * * ?'>
                                        6 hours
                                      </MenuItem>
                                      <MenuItem value='0 0 */12 * * ?'>
                                        12 hours
                                      </MenuItem>
                                      <MenuItem value='0 0 0 */1 * ?'>
                                        1 day
                                      </MenuItem>
                                      <MenuItem value='0 0 0 */30 * ?'>
                                        30 days
                                      </MenuItem>
                                    </TextField>
                                  </div>
                                )}
                              {showFields &&
                                accessToken?.accessTokenVariant ===
                                  'withCredentials' && (
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
                                        accessToken.isWWWUrlEncodingRequired !==
                                        undefined
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
                                          InputLabelProps={
                                            inputLabelPropsStyles
                                          }
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
                                      value={
                                        accessToken.accessTokenEndpointUrl || ''
                                      }
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
                                      <MenuItem value='*/59 * * * * ?'>
                                        1 hour
                                      </MenuItem>
                                      <MenuItem value='0 0 */5 * * ?'>
                                        5 hours
                                      </MenuItem>
                                      <MenuItem value='0 0 */6 * * ?'>
                                        6 hours
                                      </MenuItem>
                                      <MenuItem value='0 0 */12 * * ?'>
                                        12 hours
                                      </MenuItem>
                                      <MenuItem value='0 0 0 */1 * ?'>
                                        1 day
                                      </MenuItem>
                                      <MenuItem value='0 0 0 */30 * ?'>
                                        30 days
                                      </MenuItem>
                                    </TextField>
                                    {pairs.map((pair, index) => (
                                      <div className={styles.key_container}>
                                        <TextField
                                          className={styles.dynamic_fields}
                                          fullWidth={true}
                                          sx={textFieldStyles}
                                          InputLabelProps={
                                            inputLabelPropsStyles
                                          }
                                          label='Key'
                                          value={pair.key}
                                          onChange={(e) =>
                                            handleKeyChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                          name='key'
                                        />
                                        <TextField
                                          className={styles.dynamic_fields}
                                          fullWidth={true}
                                          label='Value'
                                          name='value'
                                          InputLabelProps={
                                            inputLabelPropsStyles
                                          }
                                          variant='outlined'
                                          sx={textFieldStyles}
                                          value={pair.value}
                                          onChange={(e) =>
                                            handleValueChange(
                                              index,
                                              e.target.value
                                            )
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
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion
          sx={{
            border: '1px solid #BBBBBB',
            borderRadius: '20px !important',
            boxShadow: '0px 4px 4px 0px #00000040',
            width: '100%',
          }}
        >
          <AccordionSummary
            expandIcon={
              <img
                src='https://fincuro.cdn.modyo.com/uploads/8e499487-2d90-4a08-8be6-4313ed401e64/original/Line_504.svg'
                alt='Expand'
                className={sharedStyles.aiAccordionIcon}
              />
            }
            aria-controls='panel1-content'
            id='panel1-header'
          >
            <Typography
              component='span'
              sx={{
                fontFamily: 'Ubuntu',
                fontWeight: 500,
                fontSize: '22px',
              }}
            >
              Data Source Configuration
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              select
              className={sharedStyles.aiFieldShadow}
              name='target_db_type'
              value={firstStepValues.target_db_type}
              onChange={handleChange}
              label='Target DB Type'
              fullWidth
              sx={{ minWidth: '240px', maxWidth: '100%' }}
              InputLabelProps={inputLabelPropsStyles}
            >
              <MenuItem value='postgres'>Postgres</MenuItem>
              <MenuItem value='mysql'>MySql</MenuItem>
              <MenuItem value='mongodb'>MongoDB</MenuItem>
              <MenuItem value='h2'>H2</MenuItem>
              <MenuItem value='elastic_search'>Elastic Search</MenuItem>
              <MenuItem value='oracle_db'>Oracle DB</MenuItem>
            </TextField>
            <div className={styles.drop_down_cont}>
              <TextField
                label='Url'
                name='data_source_url'
                value={firstStepValues.data_source_url}
                onChange={handleChange}
                className={`text-feild-mui ${sharedStyles.aiFieldShadow} ${sharedStyles.aiWidth48}`}
                InputLabelProps={inputLabelPropsStyles}
                variant='outlined'
              />
              <TextField
                label='Driver name'
                name='data_source_driver_name'
                value={firstStepValues.data_source_driver_name}
                onChange={handleChange}
                className={`text-feild-mui ${sharedStyles.aiFieldShadow} ${sharedStyles.aiWidth48}`}
                InputLabelProps={inputLabelPropsStyles}
                variant='outlined'
              />

              <TextField
                label='Username'
                name='data_source_username'
                value={firstStepValues.data_source_username}
                onChange={handleChange}
                className={`text-feild-mui ${sharedStyles.aiFieldShadow} ${sharedStyles.aiWidth48}`}
                InputLabelProps={inputLabelPropsStyles}
                variant='outlined'
              />
              <TextField
                label='Password'
                name='data_source_password'
                type='password'
                value={firstStepValues.data_source_password}
                onChange={handleChange}
                className={`text-feild-mui ${sharedStyles.aiFieldShadow} ${sharedStyles.aiWidth48}`}
                InputLabelProps={inputLabelPropsStyles}
                variant='outlined'
              />
            </div>
          </AccordionDetails>
        </Accordion>
        <div className={styles.buttons_warpper_composite}>
          <div className={styles.step_five_section}>
            {authorizer === 'no' && (
              <Alert severity='warning' className={styles.setp_gap_section}>
                <AlertTitle> This feature is coming soon.</AlertTitle>
              </Alert>
            )}
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
            {generateCodeClicked && !isTargetSystemSelected && (
              <Alert severity='warning' className={styles.setp_gap_section}>
                <AlertTitle>Please select Target system.</AlertTitle>
              </Alert>
            )}
          </div>
          <div className={styles.step_three_button_holder_composite}>
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
    </>
  )
}

export default withStepOneValues(CompositeStepper)
