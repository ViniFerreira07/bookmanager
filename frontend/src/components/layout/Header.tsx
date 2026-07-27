import { useAuth } from '../../contexts/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, Chip, Stack } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    await Swal.fire({ icon: 'success', title: 'Sessão encerrada', timer: 1200, showConfirmButton: false });
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(10,10,11,0.82)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <Toolbar sx={{ minHeight: 64, gap: 2 }}>
        <Box
          sx={{
            display: 'grid',
            placeItems: 'center',
            width: 34,
            height: 34,
            borderRadius: 1,
            color: 'primary.main',
            bgcolor: 'rgba(99,102,241,0.14)',
            border: '1px solid rgba(99,102,241,0.28)',
          }}
        >
          <BookIcon fontSize="small" />
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
            BookManager
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Gerenciamento moderno de bibliotecas
          </Typography>
        </Box>
        {isAuthenticated && (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Chip
              icon={<DashboardIcon />}
              label="Livros"
              size="small"
              color="primary"
              variant="outlined"
              onClick={() => navigate('/dashboard')}
            />
            {role === 'ADMIN' && (
              <Chip
                icon={<PeopleIcon />}
                label="Usuários"
                size="small"
                variant="outlined"
                onClick={() => navigate('/users')}
                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
              />
            )}
            <Button color="inherit" onClick={handleLogout} sx={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              Sair
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}