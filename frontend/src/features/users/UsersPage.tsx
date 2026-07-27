import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import Swal from 'sweetalert2';
import { userService } from '../../services/users';
import type { ApiError, User, UserFormData, UserRole } from '../../types';

const emptyForm: UserFormData = {
  username: '',
  email: '',
  password: '',
  role: 'USER',
};

const surfaceSx = {
  bgcolor: 'rgba(24,24,27,0.86)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 18px 60px -36px rgba(0,0,0,0.9)',
};

function getErrorMessage(error: unknown, fallback: string) {
  const apiError = error as { response?: { data?: ApiError } };
  return apiError.response?.data?.message || fallback;
}

function toFormData(user: User): UserFormData {
  return {
    username: user.username,
    email: user.email,
    password: '',
    role: user.role,
  };
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [formError, setFormError] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page, rowsPerPage],
    queryFn: () => userService.list({ page, size: rowsPerPage, sort: 'username', direction: 'asc' }),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: { id?: string; data: UserFormData }) => (
      payload.id ? userService.update(payload.id, payload.data) : userService.create(payload.data)
    ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      closeForm();
      await Swal.fire({ icon: 'success', title: 'Sucesso', text: 'Usuário salvo com sucesso.' });
    },
    onError: (err: unknown) => setFormError(getErrorMessage(err, 'Não foi possível salvar o usuário.')),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (payload: { id: string; active: boolean }) => userService.updateStatus(payload.id, payload.active),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      await Swal.fire({ icon: 'success', title: 'Excluído', text: 'Usuário excluído com sucesso.' });
    },
  });

  const users = useMemo(() => data?.content ?? [], [data]);

  const closeForm = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setFormError('');
  };

  const openCreate = () => {
    setEditingUser({
      id: '',
      username: '',
      email: '',
      role: 'USER',
      active: true,
      createdAt: '',
      updatedAt: null,
    });
    setForm(emptyForm);
    setFormError('');
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm(toFormData(user));
    setFormError('');
  };

  const onDelete = async (user: User) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: `Esta ação não poderá ser desfeita para ${user.username}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(user.id);
    }
  };

  const onToggleStatus = async (user: User) => {
    const nextActive = !user.active;
    const result = await Swal.fire({
      title: nextActive ? 'Ativar usuário?' : 'Inativar usuário?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: nextActive ? 'Ativar' : 'Inativar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      toggleStatusMutation.mutate({ id: user.id, active: nextActive });
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (!form.username.trim() || !form.email.trim()) {
      setFormError('Nome e email são obrigatórios.');
      return;
    }

    if (!editingUser?.id && !form.password.trim()) {
      setFormError('Senha é obrigatória para cadastro.');
      return;
    }

    saveMutation.mutate({
      id: editingUser?.id || undefined,
      data: form,
    });
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Usuários</Typography>
          <Typography color="text.secondary">Gerenciamento administrativo de contas e permissões.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Novo usuário</Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>Falha ao carregar usuários.</Alert>}
      {deleteMutation.error && <Alert severity="error" sx={{ mb: 2 }}>{getErrorMessage(deleteMutation.error, 'Falha ao excluir usuário.')}</Alert>}

      {isLoading ? (
        <Stack spacing={2}>{[1, 2, 3].map((item) => <Skeleton key={item} variant="rounded" height={64} />)}</Stack>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, ...surfaceSx, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.role} color={user.role === 'ADMIN' ? 'primary' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={user.active ? 'Ativo' : 'Inativo'} color={user.active ? 'success' : 'warning'} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" startIcon={<EditIcon />} onClick={() => openEdit(user)}>Editar</Button>
                    <Button
                      size="small"
                      color={user.active ? 'warning' : 'success'}
                      startIcon={user.active ? <ToggleOffIcon /> : <ToggleOnIcon />}
                      onClick={() => onToggleStatus(user)}
                    >
                      {user.active ? 'Inativar' : 'Ativar'}
                    </Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(user)}>Excluir</Button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ fontWeight: 700 }}>Nenhum usuário encontrado</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={data?.totalElements ?? 0}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      )}

      <Dialog open={Boolean(editingUser)} onClose={closeForm} maxWidth="sm" fullWidth slotProps={{ paper: { sx: surfaceSx } }}>
        <Box component="form" onSubmit={onSubmit}>
          <DialogTitle>{editingUser?.id ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {formError && <Alert severity="error">{formError}</Alert>}
              <TextField
                label="Nome"
                required
                value={form.username}
                onChange={(event) => setForm((old) => ({ ...old, username: event.target.value }))}
              />
              <TextField
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((old) => ({ ...old, email: event.target.value }))}
              />
              <TextField
                label={editingUser?.id ? 'Nova senha (opcional)' : 'Senha'}
                type="password"
                required={!editingUser?.id}
                value={form.password}
                onChange={(event) => setForm((old) => ({ ...old, password: event.target.value }))}
              />
              <TextField
                select
                label="Role"
                value={form.role}
                onChange={(event) => setForm((old) => ({ ...old, role: event.target.value as UserRole }))}
              >
                <MenuItem value="USER">USER</MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeForm}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
