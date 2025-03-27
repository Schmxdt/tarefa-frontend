import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Paper, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button} from '@mui/material'
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material'
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
  const [openModal, setOpenModal] = useState(false);

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
    };

    try {
      if (params.id) {
        const { id } = params;
        payLoad.id = id;
        await api.put(`/tarefas`, payLoad);
      } else {
        await api.post('/tarefas', payLoad);
      }

      setOpenModal(true);

      setTimeout(() => {
        history(-1); 
      }, 1500); 

    } catch (error) {
      const err = error as { response?: { data?: { data?: { name?: string } } } };
      console.log(err.response?.data);
      setMainError(err.response?.data?.data?.name || 'Erro ao salvar a tarefa');
    }
  }, [params, history]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };



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
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Sucesso!</DialogTitle>
        <DialogContent>
          A tarefa foi salva com sucesso.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>


  )
}

export default TarefaForm
