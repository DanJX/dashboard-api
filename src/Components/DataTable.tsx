
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Typography, Modal, TextField, Alert, Snackbar, Paper, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { createUser, getUsers, updateUser, deleteUser } from '../Services/UserService';

interface Users {
    pkUsuario: number;
    nombre: string;
    user: string;
    password: string;
    fkRol: number;
}

const CustomTextField = styled(TextField)({
    '& label': {
        color: 'black',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'black',
        },
        '&:hover fieldset': {
            borderColor: '#1B4965',
        },
        '& input': {
            color: '#1B4965',
        }
    }
});

export default function DataTable() {
    const [rows, setRows] = useState<Users[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Users | null>(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getUsers();
            setRows(data);
        } catch (e) {
            console.error(e);
        }
    };

    const OpenModal = () => setOpen(true);
    const CloseModal = () => setOpen(false);

    const EditUser = (user: Users) => {
        setSelectedUser(user);
        OpenModal();
    };

    const DeletUser = async (id: number) => {
        try {
            await deleteUser(id);
            setAlertMessage('¡Usuario eliminado exitosamente!');
            setAlertSeverity('success');
            setAlertOpen(true);
            await fetchData();
        } catch (e) {
            console.error(e);
            setAlertMessage('Error al eliminar el usuario');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const handleAdd = () => {
        setSelectedUser({ pkUsuario: 0, nombre: '', user: '', fkRol: 0, password: '' });
        OpenModal();
    };

    const handleSave = async () => {
        if (selectedUser) {
            if (selectedUser.pkUsuario) {
                try {
                    await updateUser(selectedUser);
                    await fetchData();
                    setAlertMessage('¡Usuario actualizado exitosamente!');
                    setAlertOpen(true);
                } catch (e) {
                    console.error(e);
                }
            } else {
                try {
                    await createUser(selectedUser);
                    await fetchData();
                    setAlertMessage('¡Usuario creado exitosamente!');
                    setAlertOpen(true);
                } catch (e) {
                    console.error(e);
                }
            }
        }
        CloseModal();
    };

    const columns: GridColDef[] = [
        { field: 'pkUsuario', headerName: 'ID', width: 90, align: 'center', headerAlign: 'center' },
        {
            field: 'fkRol',
            headerName: 'ID Rol',
            width: 150,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'nombre',
            headerName: 'Nombre',
            width: 150,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'user',
            headerName: 'Usuario',
            width: 150,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <strong>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => EditUser(params.row)}
                        style={{ marginRight: 8, borderRadius: '20px'}}
                    >
                        <EditIcon />
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        style={{ borderRadius: '20px'}}
                        onClick={() => DeletUser(params.row.pkUsuario)}
                    >
                        <DeleteIcon />
                    </Button>
                </strong>
            ),
        },
    ];

    const RefreshTable = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Users) => {
        if (selectedUser) {
            setSelectedUser({
                ...selectedUser,
                [field]: field === 'fkRol' ? parseInt(e.target.value, 10) : e.target.value,
            });
        }
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '25px',
            marginLeft: 'auto',
            marginRight: 'auto',
        }}>
            <Paper>
                {/* Tabla */}
                <Grid item xs={12} md={12} lg={12}>
                    <Box sx={{ margin: '20px 50px', display:'flex', flexWrap:'wrap', justifyContent:'space-between' }}>
                        <Typography><strong>Usuarios</strong></Typography>
                        <Button variant="contained" onClick={handleAdd} sx={{background:'green'}}>
                            Crear usuario
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowId={(row) => row.pkUsuario}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5]}
                    />
                </Grid>
            </Paper>
            {/* Modal Create/Update */}
            <Modal open={open} onClose={CloseModal}>
                <Box
                    component="form"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        background: 'white',
                        border: '2px solid #FFF',
                        borderRadius: '20px',
                        boxShadow: 24
                    }}
                >
                    {/* Titulo */}
                    <Box sx={{
                        display: 'flex',
                        backgroundColor: '#1B4965',
                        padding: '20px',
                        borderRadius: '20px',
                        marginBottom: '5px',
                    }}>
                        <Typography variant="h6" component="h2" sx={{
                            color: '#FFF',
                            fontWeight: 'bold',
                        }}>
                            {selectedUser?.pkUsuario ? 'Editar usuario' : 'Crear usuario'}
                        </Typography>
                    </Box>
                    {/* Contenido */}
                    <Box sx={{ padding: '20px' }}>
                        <CustomTextField
                            label="Nombre"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={selectedUser?.nombre || ''}
                            onChange={(e) => RefreshTable(e, 'nombre')}
                        />
                        <CustomTextField
                            label="Usuario"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={selectedUser?.user || ''}
                            onChange={(e) => RefreshTable(e, 'user')}
                        />
                        <CustomTextField
                            label="Contraseña"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={selectedUser?.password || ''}
                            onChange={(e) => RefreshTable(e, 'password')}
                        />
                        <CustomTextField
                            label="Rol"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={selectedUser?.fkRol || ''}
                            onChange={(e) => RefreshTable(e, 'fkRol')}
                        />
                        <Box sx={{ marginTop: '20px' }}>
                            <Button variant="contained" onClick={handleSave} sx={{ background: '#1B4965', fontWeight: 'bold', width: '100%' }}>
                                Guardar
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            {/* Alerta de acciones */}
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
