import React from 'react'
import { Container, Box, Typography, Grid, Link } from '@mui/material'
import { useStyles } from './styles'

type Props = React.HTMLAttributes<HTMLElement>

const LoginFooter: React.FC<Props> = (props: Props) => {
	const classes = useStyles()

	return (
    <Box component="footer" className={classes.footer}>
      <Container maxWidth="sm">
        <Typography component={'span'} variant="body1">
          <Grid container>
            <Grid item xs className={classes.copyright}>
              <Typography component={'span'} variant="body2">
                © {(new Date().getFullYear())} Schmidt
              </Typography>
            </Grid>
            <Grid item xs className={classes.policy}>
              <Link href="https://tarefa.com/terms.html" variant="body2"  >
                Políticas de Privacidade & Termos de uso
              </Link>
            </Grid>
          </Grid>
        </Typography>
      </Container>
    </Box>
	)
}

export default LoginFooter
