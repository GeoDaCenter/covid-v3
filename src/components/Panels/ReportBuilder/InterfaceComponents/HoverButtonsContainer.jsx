import { Stack } from '@mui/material'

/**
 * Flex row container for hover buttons
 *
 * @category Components/ReportBuilder
 * @param {React.ReactNode} props.children
 */
function HoverButtonsContainer({ children }){
    return (
        <Stack
            direction="row"
            gap={2}
            sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '100%',
            }}
        >
            {children}
        </Stack>
    )
}

export { HoverButtonsContainer }