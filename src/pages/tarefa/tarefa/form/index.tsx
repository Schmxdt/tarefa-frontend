import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Paper, Grid, TextField, InputLabel } from '@mui/material'
import { FormGroup, FormControlLabel, Checkbox, FormControl } from '@mui/material'
import TextareaAutosize from '@mui/base/TextareaAutosize';
import NumericInput from 'material-ui-numeric-input'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormHeader, FormAlert } from 'components'
import ListIcon from '@mui/icons-material/List'
import * as yup from 'yup'
import { useStyles } from './styles'
import api from 'services/api'
import { ITarefaDTO } from 'data/dtos/tarefa/i-tarefa-dto'

interface IRouteParams extends Record<string, string | undefined> {
  id?: string
}

const TarefaForm: React.FC = () => {
  const [mainError, setMainError] = useState('')

  const params = useParams<IRouteParams>()
  const firstInputElement = useRef(null)
  const classes = useStyles()
  const history = useNavigate()

  const validationSchema = yup.object().shape({
    name: yup.string()
      .required('Campo obrigatório'),
    description: yup.string()
      .required('Campo obrigatório'),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm<ITarefaDTO>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      description: '',
      status: false,
    }
  })

  useEffect(() => {
    async function loadData() {
      const { id } = params

      // form data
      await api
        .get(`/tarefas/${id}`)
        .then(response => {
          const { data } = response.data

          const tarefaResult = {
            name: data.name,
            description: data.description,
            status: data.status,
          }

          return tarefaResult
        })
        .then((tarefaResult: ITarefaDTO) => {
          reset(tarefaResult)
        })
        .catch(error => {
          console.log(error)
          return error
        })
    }

    if (params.id) {
      loadData()
    }
  }, [params, params.id])


  // data save
  const onSubmit = useCallback(async (data: ITarefaDTO) => {
    const payLoad: ITarefaDTO = {
      name: data.name,
      description: data.description,
      status: data.status,
    }

    if (params.id) {
      const { id } = params

      payLoad.id = id

      await api
        .put(`/tarefas`, payLoad)
        .then(() => history('/tarefas'))
        .catch(error => {
          console.log(error.response.data)
          setMainError(error.response.data.data.name)
          return error.response.data.data
        })
    } else {
      await api
        .post('/tarefas', payLoad)
        .then(() => history('/tarefas/new'))
        .then(() => reset())
        .then(() => setTimeout(() => { firstInputElement.current.focus() }, 0))
        .catch(error => {
          console.log(error.response.data)
          setMainError(error.response.data.data.name)
          return error.response.data.data
        })
    }
  }, [])


  const handleChange = (formField: any) => {
    setMainError('')
  }

  return (
    <Paper elevation={3} className={classes.paper}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        data-testid="form"
      >
        <FormHeader
          title="Tarefas"
          icon={ListIcon}
          backRoute="/tarefas"
          showSaveButton={true}
          helpText="Dados sobre Tarefas."
        />

        <FormAlert setMainError={setMainError} mainError={mainError} />

        <Grid container spacing={1} className={mainError === '' ? classes.formContainer : classes.formContainerWithError}>

          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <TextField
              id="name"
              label="Nome"
              error={!!errors.name}
              helperText={errors?.name?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              autoFocus
              inputRef={firstInputElement}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                maxLength: 100
              }}
              {...register("name",
                { onChange: (e) => handleChange(e) }
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <TextField
              id="description"
              label="Descrição"
              error={!!errors.description}
              helperText={errors?.description?.message}
              variant="outlined"
              margin="dense"
              size="small"
              fullWidth={true}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                maxLength: 100
              }}
              {...register("description",
                { onChange: (e) => handleChange(e) }
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormGroup className={classes.checkBox}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value}
                      />
                    }
                    label="Concluído?"
                  />
                )}
              />
            </FormGroup>
          </Grid>

        </Grid>
      </Box>
    </Paper>
  )
}

export default TarefaForm
