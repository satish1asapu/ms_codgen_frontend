import React, { createContext, useContext, useState } from 'react'

export const StepOneContext = createContext({
  groupId: '',
  swaggerDocumentPath: '',
  applicationName: '',
  version: '',
  basePath: '',
  applicationTargetPath: '',
  controllersPackage: '',
  programming_language: '',
  javaVersion: '',
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
  configuration:'',
  zeebeUrl: '',
  processId: '',
  secretConfigurationRequired: '',
  secretConfigurationType: '',
  secretConfigurationKey: '',
  swaggerSqlDocumentPath: '',
  streaming_endpoint: '',
})

export const useStepOneContext = () => {
  const { firstStepValues, setFirstStepValues } = useContext(StepOneContext)

  return { firstStepValues, setFirstStepValues }
}

export const StepOneProvider = (props) => {
  const [firstStepValues, setFirstStepValues] = useState({
    groupId: '',
    swaggerDocumentPath: '',
    applicationName: '',
    version: '1.0.0-SNAPSHOT',
    basePath: '/v3',
    applicationTargetPath: 'C:/Users/harsha/Downloads/',
    controllersPackage: '',
    programming_language: '',
    javaVersion: '',
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
     configuration:'',
    zeebeUrl: '',
    processId: '',
    client: '',
    secretConfigurationRequired: null,
    secretConfigurationType: '',
    secretConfigurationKey: '',
    swaggerSqlDocumentPath: '',
    streaming_endpoint: '',
  })

  return (
    <StepOneContext.Provider value={{ firstStepValues, setFirstStepValues }}>
      {props.children}
    </StepOneContext.Provider>
  )
}

export const withStepOneValues = (Component) => {
  const WithStepOneValues = (props) => {
    return (
      <StepOneProvider>
        <Component {...props} />
      </StepOneProvider>
    )
  }
  return WithStepOneValues
}
