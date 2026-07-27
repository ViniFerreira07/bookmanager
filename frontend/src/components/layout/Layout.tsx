import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';

export default function Layout() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
