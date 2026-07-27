import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs, { type Dayjs } from 'dayjs';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
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
  Tooltip,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { bookService } from '../../services/books';
import type { ApiError, Book, BookFormData } from '../../types';
import Swal from 'sweetalert2';

const surfaceSx = {
  bgcolor: 'rgba(24,24,27,0.86)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 18px 60px -36px rgba(0,0,0,0.9)',
};

const emptyForm: BookFormData = {
  title: '',
  author: '',
  year: '',
  description: '',
  coverUrl: '',
};

function toFormData(book: Book): BookFormData {
  return {
    title: book.title,
    author: book.author,
    year: String(book.year ?? ''),
    description: book.description ?? '',
    coverUrl: book.coverUrl ?? '',
  };
}

function toYearValue(year: string): Dayjs | null {
  if (!year.trim()) {
    return null;
  }

  const parsedYear = Number(year);
  return Number.isFinite(parsedYear) ? dayjs(`${parsedYear}-01-01`) : null;
}

function formatDate(value: string | null) {
  if (!value) {
    return 'Nunca atualizado';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getErrorMessage(error: unknown, fallback: string) {
  const apiError = error as { response?: { data?: ApiError } };
  return apiError.response?.data?.message || fallback;
}

function BookCover({ book }: { book: Book }) {
  if (book.coverUrl) {
    return (
      <Box
        component="img"
        src={book.coverUrl}
        alt={`${book.title} capa`}
        sx={{
          width: 34,
          height: 48,
          objectFit: 'cover',
          borderRadius: 0.75,
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        width: 34,
        height: 48,
        borderRadius: 0.75,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.7), rgba(236,72,153,0.42))',
        border: '1px solid rgba(255,255,255,0.12)',
      }}
    />
  );
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form, setForm] = useState<BookFormData>(emptyForm);
  const [formError, setFormError] = useState('');

  const isFormOpen = Boolean(editingBook);
  const hasFilters = Boolean(searchTitle || searchAuthor);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['books', page, rowsPerPage, searchTitle, searchAuthor],
    queryFn: () => bookService.search({
      title: searchTitle || undefined,
      author: searchAuthor || undefined,
      page,
      size: rowsPerPage,
      sort: 'title',
      direction: 'asc',
    }),
  });

  const stats = useMemo(() => {
    const books = data?.content ?? [];
    const currentYear = new Date().getFullYear();
    const years = books
      .map((book) => book.year)
      .filter((year): year is number => typeof year === 'number');

    return {
      visible: books.length,
      total: data?.totalElements ?? 0,
      authors: new Set(books.map((book) => book.author)).size,
      newest: years.length ? Math.max(...years) : currentYear,
    };
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload: { id?: string; data: BookFormData }) => (
      payload.id
        ? bookService.update(payload.id, payload.data)
        : bookService.create(payload.data)
    ),
    onSuccess: async (book) => {
      await queryClient.invalidateQueries({ queryKey: ['books'] });
      setSelectedBook(book);
      closeForm();
      await Swal.fire({ icon: 'success', title: 'Sucesso', text: 'Livro salvo com sucesso.' });
    },
    onError: async (err: unknown) => {
      setFormError(getErrorMessage(err, 'Não foi possível salvar o livro'));
      await Swal.fire({ icon: 'error', title: 'Erro ao salvar', text: getErrorMessage(err, 'Não foi possível salvar o livro') });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bookService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['books'] });
      setSelectedBook(null);
      await Swal.fire({ icon: 'success', title: 'Livro excluído com sucesso.' });
    },
  });

  const openCreate = () => {
    setEditingBook(null);
    setForm(emptyForm);
    setFormError('');
    setEditingBook({ id: '', ...emptyForm, year: null, createdAt: '', updatedAt: null });
  };

  const openEdit = (book: Book) => {
    setEditingBook(book);
    setForm(toFormData(book));
    setFormError('');
  };

  const closeForm = () => {
    setEditingBook(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim() || !form.author.trim() || !form.year.trim()) {
      setFormError('Título, autor e ano são obrigatórios.');
      return;
    }

    saveMutation.mutate({
      id: editingBook?.id || undefined,
      data: form,
    });
  };

  const resetFilters = () => {
    setSearchTitle('');
    setSearchAuthor('');
    setPage(0);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const confirmDelete = async (book: Book) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não poderá ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(book.id);
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{
          mb: 3,
          alignItems: { xs: 'stretch', md: 'flex-end' },
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ fontFamily: 'monospace', letterSpacing: 1.8 }}>
            Biblioteca
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Livros
          </Typography>
          <Typography color="text.secondary">
            Pesquise, adicione, inspecione, edite e remova títulos do catálogo.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} sx={{ height: 40 }}>
          Adicionar Livro
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1, borderRadius: 2, ...surfaceSx }}>
          <CardContent>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box sx={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 1, bgcolor: 'rgba(99,102,241,0.14)', color: 'primary.main', border: '1px solid rgba(99,102,241,0.24)' }}>
                <AutoStoriesIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h5">{stats.total}</Typography>
                <Typography variant="body2" color="text.secondary">total de livros</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, borderRadius: 2, ...surfaceSx }}>
          <CardContent>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box sx={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 1, bgcolor: 'rgba(16,185,129,0.12)', color: 'secondary.main', border: '1px solid rgba(16,185,129,0.22)' }}>
                <PersonSearchIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h5">{stats.authors}</Typography>
                <Typography variant="body2" color="text.secondary">autores visíveis</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, borderRadius: 2, ...surfaceSx }}>
          <CardContent>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box sx={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 1, bgcolor: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.22)' }}>
                <CalendarMonthIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h5">{stats.newest}</Typography>
                <Typography variant="body2" color="text.secondary">ano mais novo</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, ...surfaceSx }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' } }}>
          <TextField
            label="Pesquisar por título"
            size="small"
            value={searchTitle}
            onChange={(event) => { setSearchTitle(event.target.value); setPage(0); }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Pesquisar por autor"
            size="small"
            value={searchAuthor}
            onChange={(event) => { setSearchAuthor(event.target.value); setPage(0); }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonSearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ flex: 1 }}
          />
          <Tooltip title="Limpar filtros">
            <span>
              <IconButton onClick={resetFilters} disabled={!hasFilters}>
                <RestartAltIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>Falha ao carregar livros.</Alert>}
      {deleteMutation.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(deleteMutation.error, 'Não foi possível excluir o livro')}
        </Alert>
      )}

      {isLoading ? (
        <Stack spacing={2}>
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} variant="rounded" height={72} />
          ))}
        </Stack>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, ...surfaceSx, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
                <TableCell>Título</TableCell>
                <TableCell>Autor</TableCell>
                <TableCell>Ano</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.content.map((book) => (
                <TableRow
                  key={book.id}
                  hover
                  selected={selectedBook?.id === book.id}
                  sx={{
                    '&:hover': { bgcolor: 'rgba(99,102,241,0.08) !important' },
                    '&.Mui-selected': { bgcolor: 'rgba(99,102,241,0.12)' },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <BookCover book={book} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700 }} noWrap>{book.title}</Typography>
                        {book.coverUrl && (
                          <Chip
                            size="small"
                            icon={<ImageIcon />}
                            label="Capa"
                            sx={{ height: 22, mt: 0.5, bgcolor: 'rgba(99,102,241,0.12)', color: 'text.secondary' }}
                          />
                        )}
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.year}</TableCell>
                  <TableCell sx={{ maxWidth: 360 }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {book.description || 'Nenhuma descrição informada.'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Ver detalhes">
                      <IconButton onClick={() => setSelectedBook(book)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar livro">
                      <IconButton color="primary" onClick={() => openEdit(book)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir livro">
                      <IconButton color="error" onClick={() => confirmDelete(book)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {data?.content.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ fontWeight: 700 }}>Nenhum livro encontrado</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {hasFilters ? 'Tente filtros diferentes ou limpe a pesquisa.' : 'Adicione o primeiro livro para começar.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
              {isFetching ? 'Atualizando catálogo...' : `${stats.visible} visíveis nesta página`}
            </Typography>
            <TablePagination
              component="div"
              count={data?.totalElements ?? 0}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Stack>
        </TableContainer>
      )}

      <Dialog open={isFormOpen} onClose={closeForm} maxWidth="sm" fullWidth slotProps={{ paper: { sx: surfaceSx } }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box component="form" onSubmit={handleSubmit}>
            <DialogTitle>{editingBook?.id ? 'Editar Livro' : 'Adicionar Livro'}</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ pt: 1 }}>
                {formError && <Alert severity="error">{formError}</Alert>}
                <TextField
                  label="Título"
                  fullWidth
                  required
                  value={form.title}
                  slotProps={{ htmlInput: { maxLength: 150 } }}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                />
                <TextField
                  label="Autor"
                  fullWidth
                  required
                  value={form.author}
                  slotProps={{ htmlInput: { maxLength: 150 } }}
                  onChange={(event) => setForm({ ...form, author: event.target.value })}
                />
                <DatePicker
                  views={['year']}
                  openTo="year"
                  label="Ano"
                  value={toYearValue(form.year)}
                  onChange={(value) => setForm((current) => ({
                    ...current,
                    year: value ? String(value.year()) : '',
                  }))}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
                <TextField
                  label="Descrição"
                  fullWidth
                  multiline
                  rows={4}
                  value={form.description}
                  slotProps={{ htmlInput: { maxLength: 1000 } }}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
                <TextField
                  label="URL da Capa"
                  fullWidth
                  value={form.coverUrl}
                  onChange={(event) => setForm({ ...form, coverUrl: event.target.value })}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeForm}>Cancelar</Button>
              <Button type="submit" variant="contained" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogActions>
          </Box>
        </LocalizationProvider>
      </Dialog>

      <Dialog open={Boolean(selectedBook)} onClose={() => setSelectedBook(null)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: surfaceSx } }}>
        {selectedBook && (
          <>
            <DialogTitle>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">{selectedBook.title}</Typography>
                <IconButton onClick={() => setSelectedBook(null)} aria-label="Fechar detalhes">
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  <Chip icon={<LibraryBooksIcon />} label={selectedBook.author} size="small" variant="outlined" />
                  <Chip icon={<LocalOfferIcon />} label={selectedBook.year} size="small" variant="outlined" />
                  <Chip icon={<TrendingUpIcon />} label="Catalogado" size="small" color="primary" variant="outlined" />
                </Stack>
                <Typography color="text.secondary">
                  {selectedBook.author} | {selectedBook.year}
                </Typography>
                <Typography>{selectedBook.description || 'Nenhuma descrição informada.'}</Typography>
                {selectedBook.coverUrl && (
                  <Box
                    component="img"
                    src={selectedBook.coverUrl}
                    alt={`${selectedBook.title} capa`}
                    sx={{
                      width: '100%',
                      maxHeight: 260,
                      objectFit: 'cover',
                      borderRadius: 2,
                    }}
                  />
                )}
                <Divider />
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    Criado em {formatDate(selectedBook.createdAt)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Atualizado em {formatDate(selectedBook.updatedAt)}
                  </Typography>
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button startIcon={<EditIcon />} onClick={() => openEdit(selectedBook)}>
                Editar
              </Button>
              <Button color="error" startIcon={<DeleteIcon />} onClick={() => confirmDelete(selectedBook)}>
                Excluir
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}