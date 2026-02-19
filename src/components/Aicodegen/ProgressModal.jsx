import React from 'react'
import Dialog from '@mui/material/Dialog'
import CircularProgress from '@mui/material/CircularProgress'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import sharedStyles from '../../aicodegen.module.css'

function ProgressModal({ open, text }) {
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth='xs'
      PaperProps={{
        sx: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      }}
    >
      <DialogContent
        sx={{
          textAlign: 'center',
        }}
      >
        <CircularProgress
          size={60}
          // variant="determinate"
          // value={10}
          animation='$rotate 2s linear infinite'
          sx={{
            color: 'black',
            '.MuiCircularProgress-root': {
              color: 'black',
            },
            '@keyframes rotate': {
              '0%': {
                transform: 'rotate(0deg)',
              },
              '100%': {
                transform: 'rotate(360deg)',
              },
            },
          }}
        />
        <Typography variant='body2' className={sharedStyles.aiProgressText}>
          {text}
        </Typography>
      </DialogContent>
    </Dialog>
  )
}

export default ProgressModal
