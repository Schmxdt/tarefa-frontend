import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import { CustomTable, FormHeader } from 'components';
import ListIcon from '@mui/icons-material/List';
import { useStyles } from './styles';
import api from 'services/api';
import { ITableHeadCellDTO } from 'data/dtos/components/i-table-head-cell-dto';
import { ITarefaDTO } from 'data/dtos/tarefa/i-tarefa-dto';
import { useAlreadyMounted } from 'utils/use-already-mounted';
import LoginFooter from 'components/page-footer';

const headCells: ITableHeadCellDTO[] = [
  {
    id: 'name',
    label: 'Nome',
    width: 8,
  },
  {
    id: 'description',
    label: 'Descrição',
    width: 3,
  },
  {
    id: 'status',
    label: 'Status',
    boolean: true,
    width: 2,
  }
];

const TarefaList: React.FC = () => {
  const [loading, setLoading] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [orderByDirection, setOrderByDirection] = useState(true);
  const [rowsCount, setRowsCount] = useState(0);
  const [tarefasList, setTarefasList] = useState<ITarefaDTO[]>([]);
  const [recordToDelete, setRecordToDelete] = useState<string | null>('');
  const [columnOrder, setColumnOrder] = useState<('ASC' | 'DESC')[]>([]);

  const classes = useStyles();
  const alreadyMounted = useAlreadyMounted();

  const loadTarefas = async () => {
    setLoading(1);

    await api
      .post('/tarefas/list', { search, page, rowsPerPage, columnOrder })
      .then(async (listResponse) => {
        const { data } = listResponse.data;
        setTarefasList(data);

        await api
          .post('/tarefas/count', { search })
          .then((countResponse) => {
            const { count } = countResponse.data.data;
            setRowsCount(count);
          })
          .finally(() => setLoading(0));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = async () => {
    await api
      .delete(`/tarefas/${recordToDelete}`)
      .then(async () => {
        await loadTarefas();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!alreadyMounted) {
        loadTarefas();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    loadTarefas();
  }, [orderByDirection, rowsPerPage, page]);

  return (
    <>
      <Paper elevation={3} className={classes.paper}>
        <FormHeader
          title="Tarefas"
          icon={ListIcon}
          newRoute="/tarefas/new"
          helpText="Sistema de Gerenciamento de Tarefas com Interface ."
        />

        <CustomTable
          headCells={headCells}
          rows={tarefasList}
          totalRows={rowsCount}
          handleSearch={setSearch}
          isLoading={loading}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          page={page}
          editRoute="/tarefas/edit"
          handleDelete={handleDelete}
          handleRecordToDelete={setRecordToDelete}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
          orderByDirection={orderByDirection}
          setOrderByDirection={setOrderByDirection}
        />
      </Paper>
    </>
  );
};

export default TarefaList;
