import styles from '@/styles/app.module.scss'
import { Button, Stack } from '@mui/material'
import { useStore } from '../store/useStore'
import pkg from '../../../../package.json'
import Box from '@mui/material/Box'
import { Link as RouterLink } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import HomeTour from '@/docs/HomeTour'

const ipcRenderer = window.ipcRenderer || false

const Home = () => {
  const snackbar = useStore((state) => state.ui.snackbar)
  const getSettings = useStore((state) => state.api.getSettings)
  const getDevices = useStore((state) => state.api.getDevices)
  const addDevice = useStore((state) => state.api.addDevice)
  const scanForDevices = useStore((state) => state.api.scanForDevices)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    enqueueSnackbar(snackbar.message, { variant: snackbar.variant })
  }, [snackbar])

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        overflowX: 'hidden',
      }}
      className={styles.app}>
      <header
        className={styles.appHeader}
        style={{
          minHeight:
            ipcRenderer && pkg.env.VITRON_CUSTOM_TITLEBAR
              ? 'calc(100vh - 30px)'
              : '100vh',
        }}>
        <p>Welcome to LedFx v3</p>
        <Stack spacing={1}>
          {/* <HomeTour>Tour</HomeTour> */}
          <Button onClick={() => enqueueSnackbar('I love hooks')}>Notification</Button>
          <Button onClick={() => getSettings()}>getSettings</Button>          
          <Button onClick={() => getDevices()}>getDevices</Button>          
          <Button onClick={() => addDevice().then(()=>getDevices())}>addDevice</Button>          
          <Button onClick={() => scanForDevices()}>scanForDevices</Button>          
          <Button component={RouterLink} to='/Example' size={'large'}>Basic Examples</Button>
        </Stack>
      </header>
    </Box>
  )
}

export default Home