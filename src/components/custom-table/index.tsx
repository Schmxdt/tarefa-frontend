import React, { useState, useEffect } from 'react';
import { Paper, InputBase, TablePagination, LinearProgress, IconButton, Chip } from '@mui/material';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, TableSortLabel } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { ITableHeadCellDTO } from 'data/dtos/components/i-table-head-cell-dto';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useStyles } from './styles';
import { useNavigate } from 'react-router-dom';

type Props = {
  headCells: ITableHeadCellDTO[];
  rows: any[];
  totalRows: number;
  handleSearch: React.Dispatch<React.SetStateAction<string>>;
  isLoading: number;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => Promise<void>;
  rowsPerPage: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  page: number;
  editRoute: string;
  handleDelete: () => void;
  handleRecordToDelete: React.Dispatch<React.SetStateAction<string>>;
  orderByDirection: boolean;
  setOrderByDirection: React.Dispatch<React.SetStateAction<boolean>>;
  columnOrder: ('ASC' | 'DESC')[];
  setColumnOrder: React.Dispatch<React.SetStateAction<('ASC' | 'DESC')[]>>;
};

const formatString = (fieldContent: string, format: string) => {
  let output = fieldContent;

  if (typeof fieldContent === 'boolean' && fieldContent === true) {
    output = 'X';
  }

  switch (format) {
    case 'cnpj':
      output = output.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      break;
  }

  return output;
};

// Função para renderizar o status
const renderStatus = (value: boolean) => {
  return value ? (
    <Chip
      label="Concluída"
      style={{
        padding: '3px 3px',
        backgroundColor: '#4caf50',
        color: 'white',
        fontSize: '10px',
        borderRadius: '16px',
        fontWeight: 'bold',
      }}
    />
  ) : (
    <Chip
      label="Pendente"
      style={{
        padding: '3px 6px',
        backgroundColor: '#f44336',
        color: 'white',
        fontSize: '10px',
        borderRadius: '16px',
        fontWeight: 'bold',
      }}
    />
  );
};

const CustomTable: React.FC<Props> = ({
  headCells,
  rows,
  totalRows,
  handleSearch,
  isLoading,
  handleChangeRowsPerPage,
  rowsPerPage,
  handleChangePage,
  page,
  editRoute,
  handleDelete,
  handleRecordToDelete,
  orderByDirection,
  setOrderByDirection,
  columnOrder,
  setColumnOrder,
}: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();
  const defaultWidth = headCells.length > 1 ? 100 / headCells.length : 100;

  const handleClickOpen = (record: string) => {
    setOpen(true);
    handleRecordToDelete(record);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDelete = () => {
    setOpen(false);
    handleDelete();
  };

  const handleSortChange = (index: number) => {
    columnOrder[index] = columnOrder[index] === 'ASC' ? 'DESC' : 'ASC';
    setColumnOrder(columnOrder);
    setOrderByDirection(!orderByDirection);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    handleSearch('');
  };

  useEffect(() => {
    const sortArray: Array<'ASC' | 'DESC'> = headCells.map(() => 'ASC');
    setColumnOrder(sortArray);
  }, [headCells]);

  return (
    <>
      <div className={classes.search}>
        <InputBase
          placeholder={'Informe o termo de busca aqui...'}
          className={classes.inputInput}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            handleSearch(e.target.value);
          }}
          endAdornment={searchValue && (
            <IconButton onClick={handleClearSearch} edge="end">
              <ClearIcon />
            </IconButton>
          )}
        />
      </div>

      <div className={isLoading === 1 ? classes.linearProgressOn : classes.linearProgressOff}>
        <LinearProgress />
      </div>

      <Paper className={classes.tablePaper}>
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow key={0}>
                {headCells.map((headCell, index) => (
                  <TableCell
                    key={headCell.id}
                    align="left"
                    style={{
                      width: `${typeof headCell.width !== 'undefined' ? (headCell.width * 100) / 11 : defaultWidth}%`,
                      fontWeight: 'bold',
                      color: '#20547B !important',
                    }}
                  >
                    <TableSortLabel
                      active={true}
                      direction={columnOrder[index] === 'ASC' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange(index)}
                      style={{
                        fontWeight: 'bold',
                        color: '#20547B !important',
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                {/* Coluna para os ícones de ação */}
                <TableCell style={{ fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
                <TableRow hover key={row.id}>
                  {headCells.map((headCell) => (
                    <TableCell key={headCell.id} align="left" style={{ minWidth: 100 }}>
                      {headCell.boolean ? (
                        renderStatus(row.status)

                      ) : (
                        formatString(row[headCell.id], headCell.format ?? '')
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                      <EditIcon
                        className={classes.tableIcon}
                        style={{ cursor: 'pointer', marginRight: 10 }}
                        onClick={() => navigate(`${editRoute}/${row.id}`)}
                      />
                      <DeleteIcon
                        className={classes.tableIcon}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleClickOpen(row.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página"
          labelDisplayedRows={({ from, to, count }) => `Página ${page + 1}, ${from}-${to} de ${count}`}
          sx={{
            '.MuiSvgIcon-root': {
              position: 'relative',
            },
          }}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Exclusão de Registro</DialogTitle>
        <DialogContent style={{ width: '500px' }}>
          <DialogContentText id="alert-dialog-description">
            Deseja realmente excluir o registro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Não
          </Button>
          <Button onClick={handleCloseDelete} variant="contained">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { CustomTable };
