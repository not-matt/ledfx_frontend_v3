import styles from '@/styles/app.module.scss'
import { Button, TextField, Stack, Typography } from '@mui/material'
import { useStore } from '../store/useStore'
import pkg from '../../../../package.json'
import Box from '@mui/material/Box'
import { Link as RouterLink } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

const ipcRenderer = window.ipcRenderer || false

const Home = () => {
  // @not_matt
  // - `text` is a local state
  // - only available inside this component
  // - it is not persistant
  const [text, setText] = useState('Text')

  const snackbar = useStore((state) => state.ui.snackbar)
  const devices = useStore((state) => state.api.devices)
  const virtuals = useStore((state) => state.api.virtuals)
  const effects = useStore((state) => state.api.effects)
  const connections = useStore((state) => state.api.connections)
  const settings = useStore((state) => state.api.settings)
  const schema = useStore((state) => state.api.schema)
  const getSchema = useStore((state) => state.api.getSchema)
  const getEffects = useStore((state) => state.api.getEffects)
  const getSettings = useStore((state) => state.api.getSettings)
  const getDevices = useStore((state) => state.api.getDevices)
  const enrichDevices = useStore((state) => state.api.enrichDevices)
  const addDevice = useStore((state) => state.api.addDevice)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    enqueueSnackbar(snackbar.message, { variant: snackbar.variant })
  }, [snackbar])

  const handleDevices = () => {
    getDevices().then(() => enrichDevices())
  }
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
        <Typography>
          CORE:{' '}
          {`${import.meta.env.VITE_CORE_PROTOCOL || 'http'}://${
            import.meta.env.VITE_CORE_HOST || 'localhost'
          }:${import.meta.env.VITE_CORE_PORT || '8080'}`}
        </Typography>
        <Stack spacing={1}>
          <Button onClick={() => enqueueSnackbar('I love hooks')}>
            Notification
          </Button>
          <Button onClick={() => getSettings()}>getSettings</Button>
          <Button onClick={() => getSchema()}>getSchema</Button>
          <Button onClick={() => handleDevices()}>getDevices</Button>
          <Button onClick={() => getEffects()}>getEffects</Button>
          <TextField
            variant='outlined'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            onClick={() =>
              addDevice({
                type: 'UDP Stream',
                base_config: {
                  name: text, // @not_matt here we are passing the current `text` into the function addDevice
                  pixel_count: 64,
                },
                impl_config: {
                  ip: '192.168.0.69',
                },
              }).then(() => getDevices())
            }>
            addDevice
          </Button>
          <Button component={RouterLink} to='/Example' size={'large'}>
            Basic Examples
          </Button>
        </Stack>
        <hr />
        <Typography>Devices:</Typography>
        <Typography>{JSON.stringify(devices)}</Typography>
        {/* This is how you can render Records         */}
        {Object.keys(devices).map((d) => (
          <div key={devices[d].id}>{devices[d].base_config.name}</div>
        ))}
        <hr />
        <Typography>Schema:</Typography>
        <Typography>{JSON.stringify(schema)}</Typography>
        <hr />
        <Typography>Virtuals:</Typography>
        <Typography>{JSON.stringify(virtuals)}</Typography>
        <hr />
        <Typography>Effects:</Typography>
        <Typography>{JSON.stringify(effects)}</Typography>
        <hr />
        <Typography>Connections:</Typography>
        <Typography>{JSON.stringify(connections)}</Typography>
        <hr />
        <Typography>Settings:</Typography>
        <Typography>{JSON.stringify(settings)}</Typography>
        <hr />
      </header>
    </Box>
  )
}

export default Home
