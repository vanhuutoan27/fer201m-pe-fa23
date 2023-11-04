import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  Avatar,
} from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Alert from '@mui/material/Alert';

function Dashboard() {
  const url = 'https://6543501901b5e279de202a0e.mockapi.io/api/v1/studentManagement';
  const [data, setData] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showAddSuccessAlert, setShowAddSuccessAlert] = useState(false);
  const [showAddErrorAlert, setShowAddErrorAlert] = useState(false);
  const [showUpdateSuccessAlert, setShowUpdateSuccessAlert] = useState(false);
  const [showUpdateErrorAlert, setShowUpdateErrorAlert] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
  const [showDeleteErrorAlert, setShowDeleteErrorAlert] = useState(false);

  useEffect(() => {
    if (showAddSuccessAlert || showAddErrorAlert) {
      const timeoutId = setTimeout(() => {
        setShowAddSuccessAlert(false);
        setShowAddErrorAlert(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [showAddSuccessAlert, showAddErrorAlert]);

  useEffect(() => {
    if (showUpdateSuccessAlert || showUpdateErrorAlert) {
      const timeoutId = setTimeout(() => {
        setShowUpdateSuccessAlert(false);
        setShowUpdateErrorAlert(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [showUpdateSuccessAlert, showUpdateErrorAlert]);

  useEffect(() => {
    if (showDeleteSuccessAlert || showDeleteErrorAlert) {
      const timeoutId = setTimeout(() => {
        setShowDeleteSuccessAlert(false);
        setShowDeleteErrorAlert(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [showDeleteSuccessAlert, showDeleteErrorAlert]);

  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle the "Delete" button click
  const handleDelete = (studentId) => {
    setCurrentId(studentId);
    setDeleteDialogOpen(true);
  };

  // Function to confirm and execute the delete operation
  const confirmDelete = () => {
    if (currentId) {
      axios
        .delete(`${url}/${currentId}`)
        .then((response) => {
          if (response.status === 200) {
            // Successfully deleted, update the list
            setData(data.filter((student) => student.id !== currentId));
            setShowDeleteSuccessAlert(true);
          } else {
            console.log('Failed to delete');
            setShowDeleteErrorAlert(true);
          }
        })
        .catch((error) => {
          console.log('Error:', error);
          setShowDeleteErrorAlert(true);
        })
        .finally(() => {
          setDeleteDialogOpen(false);
        });
    }
  };

  // Function to close any open dialogs
  const closeDialog = () => {
    setAddDialogOpen(false);
    setUpdateDialogOpen(false);
    setDeleteDialogOpen(false);
    setCurrentId(null);
  };

  // Formik configuration for adding student
  const addFormik = useFormik({
    initialValues: {
      name: '',
      dateofbirth: '',
      gender: '',
      class: '',
      image: '',
      feedback: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required').min(2, 'Name must more than 2 words'),
      dateofbirth: Yup.date().required('Date Of Birth is required'),
      gender: Yup.bool().required('Gender is required'),
      class: Yup.string().required('Class is required'),
      image: Yup.string().required('Image is required').url('Images must be a valid URL'),
    }),
    onSubmit: (values, { resetForm }) => {
      axios
        .post(url, values)
        .then((response) => {
          if (response.status !== 201) {
            throw new Error('Network response was not ok');
          }
          console.log('Server response:', response.data);
          setShowAddSuccessAlert(true);
          resetForm();
          setAddDialogOpen(false);
          fetchData(); // Fetch data again to update the list
        })
        .catch((error) => {
          console.error('Error:', error);
          setShowAddErrorAlert(true);
        });
    },
  });

  // Function to open the update dialog with data from a specific student item
  const openUpdateDialog = (row) => {
    setCurrentId(row.id);
    axios
      .get(`${url}/${row.id}`)
      .then((response) => {
        if (response.status === 200) {
          // Successfully fetched data and set values for updateFormik initialValues
          updateFormik.setValues(response.data); // Set initial values from the response data
          setUpdateDialogOpen(true);
        } else {
          console.log('Failed to fetch data for update');
        }
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  // Formik configuration for updating student
  const updateFormik = useFormik({
    initialValues: {
      name: data.name || '',
      dateofbirth: data.dateofbirth || '',
      gender: data.gender || '',
      class: data.class || '',
      image: data.image || '',
      feedback: data.feedback || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required').min(2, 'Name must more than 2 words'),
      dateofbirth: Yup.date().required('Date Of Birth is required'),
      gender: Yup.bool().required('Gender is required'),
      class: Yup.string().required('Class is required'),
      image: Yup.string().required('Image is required').url('Avatar must be a valid URL'),
    }),
    onSubmit: (values, { resetForm }) => {
      axios
        .put(`${url}/${currentId}`, values)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('Network response was not ok');
          }
          console.log('Server response:', response.data);
          setShowUpdateSuccessAlert(true);
          resetForm();
          setUpdateDialogOpen(false);
          fetchData(); // Fetch data again to update the list
        })
        .catch((error) => {
          console.error('Error:', error);
          setShowUpdateErrorAlert(true);
        });
    },
  });

  // Function to fetch student data
  const fetchData = () => {
    axios(url)
      .then((response) => {
        const fetchedData = response.data;
        setData(fetchedData);
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <div className="content" style={{ padding: '100px 0' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '0 40px 20px 0',
        }}
      >
        <Button
          variant="contained"
          style={{ padding: '8px 40px' }}
          onClick={() => setAddDialogOpen(true)}
        >
          Add
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell align="left" style={{ fontWeight: 'bold' }}>
                Name
              </TableCell>
              <TableCell align="left" style={{ fontWeight: 'bold' }}>
                Date Of Birth
              </TableCell>
              <TableCell align="left" style={{ fontWeight: 'bold' }}>
                Gender
              </TableCell>
              <TableCell align="left" style={{ fontWeight: 'bold' }}>
                Class
              </TableCell>
              <TableCell align="left" style={{ fontWeight: 'bold' }}>
                Avatar
              </TableCell>
              <TableCell align="left" style={{ fontWeight: 'bold' }}>
                Feedback
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.dateofbirth}</TableCell>
                <TableCell>{row.gender === true ? 'Male' : 'Female'}</TableCell>
                <TableCell>{row.class}</TableCell>
                <TableCell>
                  <Avatar alt={row.name} src={row.image} />
                </TableCell>
                <TableCell>{row.feedback}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    style={{ marginRight: '12px' }}
                    onClick={() => openUpdateDialog(row)}
                  >
                    Update
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleDelete(row.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding Student */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle style={{ fontSize: '20px', fontWeight: 'bold' }}>Add Student</DialogTitle>
        <DialogContent>
          <form onSubmit={addFormik.handleSubmit} style={{ marginTop: '8px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  value={addFormik.values.name}
                  onChange={addFormik.handleChange}
                  error={addFormik.touched.name && Boolean(addFormik.errors.name)}
                  helperText={addFormik.touched.name && addFormik.errors.name}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Class"
                  name="class"
                  value={addFormik.values.class}
                  onChange={addFormik.handleChange}
                  error={addFormik.touched.class && Boolean(addFormik.errors.class)}
                  helperText={addFormik.touched.class && addFormik.errors.class}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="date"
                  name="dateofbirth"
                  value={addFormik.values.dateofbirth}
                  onChange={addFormik.handleChange}
                  error={addFormik.touched.dateofbirth && Boolean(addFormik.errors.dateofbirth)}
                  helperText={addFormik.touched.dateofbirth && addFormik.errors.dateofbirth}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="boolean"
                  label="Gender"
                  name="gender"
                  value={addFormik.values.gender}
                  onChange={addFormik.handleChange}
                  error={addFormik.touched.gender && Boolean(addFormik.errors.gender)}
                  helperText={addFormik.touched.gender && addFormik.errors.gender}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Image"
                  name="image"
                  value={addFormik.values.image}
                  onChange={addFormik.handleChange}
                  error={addFormik.touched.image && Boolean(addFormik.errors.image)}
                  helperText={addFormik.touched.image && addFormik.errors.image}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  multiline
                  rows={3}
                  label="Feedback"
                  name="feedback"
                  value={addFormik.values.feedback}
                  onChange={addFormik.handleChange}
                  error={addFormik.touched.feedback && Boolean(addFormik.errors.feedback)}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={addFormik.handleSubmit}
            variant="contained"
            color="primary"
            style={{ marginBottom: '2%', marginRight: '2%' }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for updating student */}
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
        <DialogTitle style={{ fontSize: '20px', fontWeight: 'bold' }}>Update student</DialogTitle>
        <DialogContent>
          <form onSubmit={updateFormik.handleSubmit} style={{ marginTop: '8px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  value={updateFormik.values.name}
                  onChange={updateFormik.handleChange}
                  error={updateFormik.touched.name && Boolean(updateFormik.errors.name)}
                  helperText={updateFormik.touched.name && updateFormik.errors.name}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Class"
                  name="class"
                  value={updateFormik.values.class}
                  onChange={updateFormik.handleChange}
                  error={updateFormik.touched.class && Boolean(updateFormik.errors.class)}
                  helperText={updateFormik.touched.class && updateFormik.errors.class}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="date"
                  name="dateofbirth"
                  value={updateFormik.values.dateofbirth}
                  onChange={updateFormik.handleChange}
                  error={
                    updateFormik.touched.dateofbirth && Boolean(updateFormik.errors.dateofbirth)
                  }
                  helperText={updateFormik.touched.dateofbirth && updateFormik.errors.dateofbirth}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="boolean"
                  label="Gender"
                  name="gender"
                  value={updateFormik.values.gender}
                  onChange={updateFormik.handleChange}
                  error={updateFormik.touched.gender && Boolean(updateFormik.errors.gender)}
                  helperText={updateFormik.touched.gender && updateFormik.errors.gender}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Image"
                  name="image"
                  value={updateFormik.values.image}
                  onChange={updateFormik.handleChange}
                  error={updateFormik.touched.image && Boolean(updateFormik.errors.image)}
                  helperText={updateFormik.touched.image && updateFormik.errors.image}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  multiline
                  rows={3}
                  label="Feedback"
                  name="feedback"
                  value={updateFormik.values.feedback}
                  onChange={updateFormik.handleChange}
                  error={updateFormik.touched.feedback && Boolean(updateFormik.errors.feedback)}
                  fullWidth
                  style={{ marginBottom: '8px' }}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={updateFormik.handleSubmit}
            variant="contained"
            color="primary"
            style={{ marginBottom: '2%', marginRight: '2%' }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for deleting student */}
      <Dialog open={deleteDialogOpen} onClose={closeDialog}>
        <DialogTitle style={{ fontSize: '20px', fontWeight: 'bold' }}>Delete student</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete student {currentId}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary" style={{ color: '#000' }}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            style={{ marginBottom: '2%', marginRight: '2%' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {showAddSuccessAlert && (
        <Alert
          severity="success"
          variant="filled"
          style={{ position: 'fixed', top: '2%', right: '1%' }}
        >
          Add new Student successfully!
        </Alert>
      )}

      {showAddErrorAlert && (
        <Alert
          severity="error"
          variant="filled"
          style={{ position: 'fixed', top: '2%', right: '1%' }}
        >
          Failed to add new Student!
        </Alert>
      )}

      {showUpdateSuccessAlert && (
        <Alert
          severity="success"
          variant="filled"
          style={{ position: 'fixed', top: '2%', right: '1%' }}
        >
          Update new Student successfully!
        </Alert>
      )}

      {showUpdateErrorAlert && (
        <Alert
          severity="error"
          variant="filled"
          style={{ position: 'fixed', top: '2%', right: '1%' }}
        >
          Failed to update Student!
        </Alert>
      )}

      {showDeleteSuccessAlert && (
        <Alert
          severity="success"
          variant="filled"
          style={{ position: 'fixed', top: '2%', right: '1%' }}
        >
          Delete Student successfully!
        </Alert>
      )}

      {showDeleteErrorAlert && (
        <Alert
          severity="error"
          variant="filled"
          style={{ position: 'fixed', top: '2%', right: '1%' }}
        >
          Failed to delete new Student!
        </Alert>
      )}
    </div>
  );
}

export default Dashboard;
