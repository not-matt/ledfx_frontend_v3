import { Ledfx } from '@/api/ledfx'
import { virtual } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Slider } from '@mui/material'
import { useEffect, useState } from 'react'
import Frame from '../SchemaForm/Frame'

export interface CreateVirtualDialogProps {
    id?: string
    open: boolean
    handleClose: () => void
}

export const CreateVirtualDialog = (props: CreateVirtualDialogProps) => {
	const virtualSchema = useStore((store) => store.api.schema.virtual)
	const virtuals = useStore((store) => store.api.virtuals)
	const [config, setConfig] = useState({} as virtual['base_config'])
	const { id, open, handleClose } = props
	const [valid, setValid] = useState(id!==undefined)

	const applyDefaults = () => {
		if (virtualSchema) {            
			if (id == undefined) {
				setConfig({
					name: virtualSchema['name'].default,
					framerate: virtualSchema['framerate'].default
				})
			} else {
				const virtual = virtuals[id]
				setConfig({
					name: virtual.base_config?.name,
					framerate: virtual.base_config.framerate
				})
			}
		}
	}

	useEffect(applyDefaults, [])

	return virtualSchema && (
		<Dialog open={open} onClose={handleClose} >
			<DialogTitle>{id===undefined?'Create':'Configure'} Virtual</DialogTitle>
			<DialogContent>
				<Frame
					title={virtualSchema['name'].title}
					tip={virtualSchema['name'].description}
				>
					<Input
						value={config.name || ''}
						error={!valid}
						onChange={(event) => {
							setConfig({
								...config,
								name: event.target.value
							})
							setValid(event.target.value !== '')
						}}
					/>
				</Frame>
				<Frame
					title={virtualSchema['framerate'].title}
					tip={virtualSchema['framerate'].description}
				>
					<Slider
						min={virtualSchema['framerate'].validation.min}
						max={virtualSchema['framerate'].validation.max}
						valueLabelDisplay="auto"
						step={5}
						marks
						value={config.framerate || 0}
						onChange={(_event: Event, newValue: number | number[], _activeThumb: number) => {
							setConfig({
								...config,
								framerate: typeof newValue === 'number' ? newValue : 0,
							})
						}}
					/>
				</Frame>
			</DialogContent>
			<DialogActions>
				<Button disabled={!valid} variant="outlined" onClick={async () => {
					await Ledfx('/api/virtuals', 'POST', { 'id': id, 'base_config': config })
					handleClose()
				}}>{id===undefined?'Create':'Update'}</Button>
			</DialogActions>
		</Dialog>
	)
}
