import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Button, ButtonBase, Grid, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

function Detail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const url = `https://6543501901b5e279de202a0e.mockapi.io/api/v1/studentManagement/${id}`;
    axios(url)
      .then((response) => {
        const fetchedData = response.data;
        setStudent(fetchedData);
      })
      .catch((error) => console.log(error.message));
  }, [id]);

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content" style={{ padding: '100px 0' }}>
      <Paper
        sx={{
          p: 2,
          margin: 'auto',
          maxWidth: '100%',
          flexGrow: 1,
        }}
      >
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase>
              <Img
                alt={student.name}
                src={student.image}
                style={{ width: '500px', height: '300px' }}
              />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container style={{ marginTop: '20px', marginLeft: '20px' }}>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography style={{ fontSize: '32px', fontWeight: '600' }}>
                  Student ID: {student.id}
                </Typography>
                <Typography style={{ fontSize: '32px', fontWeight: '600' }}>
                  Student Name: {student.name}
                </Typography>
                <Typography style={{ fontSize: '24px', color: '#6b7280' }}>
                  Date Of Birth: {student.dateofbirth}
                </Typography>
                <Typography style={{ fontSize: '24px', color: '#6b7280' }}>
                  Gender: {student.gender === true ? 'Male' : 'Female'}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography style={{ fontSize: '32px', fontWeight: '600' }}>
                {student.class}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Detail;
