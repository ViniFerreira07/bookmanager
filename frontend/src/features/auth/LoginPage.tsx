import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookIcon from '@mui/icons-material/Book';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import type { ApiError } from '../../types';

function getErrorMessage(error: unknown) {
  const apiError = error as { response?: { data?: ApiError } };
  return apiError.response?.data?.message || 'Falha na autenticação';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setUsername('');
    setEmail('');
    setPassword('');
    setLoading(false);
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'register') {
        await register({ username, email, password });
        await Swal.fire({ icon: 'success', title: 'Conta criada', text: 'Cadastro realizado com sucesso.' });
      } else {
        await login({ email, password });
        await Swal.fire({ icon: 'success', title: 'Bem-vindo', text: 'Login realizado com sucesso.', timer: 1200, showConfirmButton: false });
      }
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      await Swal.fire({ icon: 'error', title: 'Falha na autenticação', text: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(420px, 1fr)' },
        minHeight: '100vh',
        color: 'text.primary',
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 5,
          borderRight: '1px solid rgba(255,255,255,0.08)',
          background:
            'radial-gradient(circle at 20% 0%, rgba(99,102,241,0.26), transparent 34rem), radial-gradient(circle at 80% 100%, rgba(236,72,153,0.12), transparent 30rem), #0a0a0b',
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <Box sx={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 1, bgcolor: 'rgba(99,102,241,0.16)', color: 'primary.main', border: '1px solid rgba(99,102,241,0.28)' }}>
            <BookIcon fontSize="small" />
          </Box>
          <Typography sx={{ fontWeight: 700 }}>BookManager</Typography>
        </Stack>

        <Box sx={{ maxWidth: 470 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1.08, mb: 2 }}>
            Uma forma mais tranquila de gerenciar sua biblioteca.
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
            Gerencie entradas do catálogo, autores e atividades de leitura com a clareza de um espaço de trabalho moderno.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 4 }}>
            {['#6366f1', '#10b981', '#f59e0b', '#ec4899'].map((color) => (
              <Box key={color} sx={{ width: 44, height: 6, borderRadius: 999, bgcolor: color }} />
            ))}
          </Stack>
        </Box>

        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} BookManager
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3, py: 6 }}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
            bgcolor: { xs: 'rgba(24,24,27,0.82)', lg: 'transparent' },
            border: { xs: '1px solid rgba(255,255,255,0.08)', lg: 'none' },
          }}
        >
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', display: { lg: 'none' }, mb: 4 }}>
            <Box sx={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 1, bgcolor: 'rgba(99,102,241,0.16)', color: 'primary.main', border: '1px solid rgba(99,102,241,0.28)' }}>
              <BookIcon fontSize="small" />
            </Box>
            <Typography sx={{ fontWeight: 700 }}>BookManager</Typography>
          </Stack>

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {mode === 'login' ? 'Entre no seu espaço de trabalho' : 'Crie sua conta de trabalho'}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            {mode === 'login' ? 'Bem-vindo de volta. Insira suas credenciais para continuar.' : 'Comece a gerenciar seu catálogo em poucos segundos.'}
          </Typography>

          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, val) => val && switchMode(val)}
            fullWidth
            sx={{
              mb: 3,
              p: 0.5,
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 1,
              bgcolor: 'rgba(255,255,255,0.03)',
              '& .MuiToggleButton-root': {
                border: 0,
                borderRadius: 0.75,
                color: 'text.secondary',
                '&.Mui-selected': {
                  bgcolor: 'rgba(99,102,241,0.18)',
                  color: 'text.primary',
                },
              },
            }}
          >
            <ToggleButton value="login">Entrar</ToggleButton>
            <ToggleButton value="register">Cadastrar</ToggleButton>
          </ToggleButtonGroup>

          <Box component="form" onSubmit={handleSubmit} key={mode} autoComplete="off">
            {mode === 'register' && (
              <TextField
                label="Nome de usuário"
                fullWidth
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                sx={{ mb: 2 }}
              />
            )}
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        onClick={() => setShowPassword((value) => !value)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              disabled={loading || !email.trim() || !password.trim() || (mode === 'register' && !username.trim())}
              sx={{ height: 44 }}
            >
              {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}
            </Button>
          </Box>
          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">ou continue com</Typography>
          </Divider>
          <Stack direction="row" spacing={1}>
            <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} disabled>
              Google
            </Button>
            <Button fullWidth variant="outlined" startIcon={<GitHubIcon />} disabled>
              GitHub
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}