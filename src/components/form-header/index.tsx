import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SvgIconComponent } from '@mui/icons-material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Typography, Box, Button, Tooltip } from '@mui/material';
import { useStyles } from './styles';

type Props = {
  icon?: SvgIconComponent;
  title: string;
  newRoute?: string;
  backRoute?: string;
  showSaveButton?: boolean;
  showUploadButton?: boolean;
  uploadButtonLabel?: string;
  uploadButtonFileTypes?: string;
  helpText?: string;
};

const renderNewButton = (navigate: any, route?: string) => {
  if (route) {
    return (
      <>
        <Button variant="contained" color="primary" onClick={() => navigate(route)}>
          Novo
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => window.location.reload()}
          style={{ marginLeft: 10 }}
        >
          Atualizar
        </Button>
      </>
    );
  }
};

const renderBackButton = (navigate: any, route?: string) => {
  if (route) {
    return (
      <Button variant="contained" color="primary" onClick={() => navigate(route)} style={{ marginLeft: 10 }}>
        Retornar
      </Button>
    );
  }
};

const renderSaveButton = (navigate: any, showButton?: boolean) => {
  if (showButton) {
    return <Button type="submit" variant="contained" color="primary">Salvar</Button>;
  }
};

const renderUploadButton = (showButton?: boolean, uploadButtonLabel?: string, uploadButtonFileTypes?: string) => {
  if (showButton) {
    return (
      <Button component="label" variant="contained" color="primary" style={{ marginRight: 10 }}>
        {uploadButtonLabel || 'Upload'}
        <input type="file" accept={uploadButtonFileTypes || '*.*'} hidden />
      </Button>
    );
  }
};

const renderHelpIcon = (classes: any, helpText?: string) => {
  if (helpText) {
    return (
      <Tooltip title={helpText} placement="right-end" arrow={true}>
        <HelpOutlineIcon className={classes.formTitleHelpIcon} />
      </Tooltip>
    );
  }
};

const FormHeader: React.FC<Props> = ({
  icon,
  title,
  newRoute,
  backRoute,
  showSaveButton,
  showUploadButton,
  uploadButtonLabel,
  uploadButtonFileTypes,
  helpText
}: Props) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Typography variant="h5" className={classes.formTitle}>
      <Box className={classes.formTitleLeft}>
        {title}
        {renderHelpIcon(classes, helpText)}
      </Box>
      <Box className={classes.formButtonsRight}>
        {renderUploadButton(showUploadButton, uploadButtonLabel, uploadButtonFileTypes)}
        {renderNewButton(navigate, newRoute)}
        {renderSaveButton(backRoute, showSaveButton)}
        {renderBackButton(navigate, backRoute)}
      </Box>
    </Typography>
  );
};

export { FormHeader };
