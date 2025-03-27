import React from 'react'

import { ApplicationProvider } from '../contexts/application-context'

const AppProvider: React.FC = ({ children }) => ( 
    <ApplicationProvider>
      {children}
    </ApplicationProvider> 
)

export default AppProvider
