import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActions } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const url = 'https://6543501901b5e279de202a0e.mockapi.io/api/v1/studentManagement';
  const [student, setStudent] = useState([]);

  useEffect(() => {
    axios(url)
      .then((response) => {
        const allStudents = response.data;
        const sortedByName = [...allStudents].sort((a, b) => a.name.localeCompare(b.name));
        setStudent(sortedByName);
      })
      .catch((error) => console.log(error.message));
  }, []);

  return (
    <div className="content" style={{ padding: '120px 0' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {student.map((studentItem) => (
            <Grid item xs={2} sm={4} md={4} key={studentItem.id}>
              <Card
                sx={{ maxWidth: 360 }}
                style={{ margin: '40px 0 40px 20px', borderRadius: '8px' }}
              >
                <CardMedia
                  component="img"
                  height="320"
                  image={studentItem.image}
                  alt={studentItem.name}
                />
                <CardContent>
                  <Typography style={{ fontSize: '20px', fontWeight: '600' }}>
                    <Link to={`/detail/${studentItem.id}`}>Student ID: {studentItem.id}</Link>
                  </Typography>
                  <Typography style={{ fontSize: '20px', fontWeight: '600' }}>
                    Student Name: {studentItem.name}
                  </Typography>
                  <Typography style={{ fontSize: '20px', color: '#6b7280' }}>
                    Class: {studentItem.class}
                  </Typography>
                  <Typography
                    style={{
                      fontSize: '20px',
                      color: '#6b7280',
                    }}
                  >
                    Date Of Birth: {studentItem.dateofbirth}
                  </Typography>
                  <Typography style={{ fontSize: '20px', color: '#6b7280' }}>
                    Gender: {studentItem.gender === true ? 'Male' : 'Female'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    to={`/detail/${studentItem.id}`}
                    size="medium"
                    style={{
                      padding: '12px 100px',
                      background: '#1950d2',
                      color: '#fff',
                      fontWeight: '600',
                      margin: '8px auto',
                    }}
                  >
                    <VisibilityIcon style={{ marginRight: '8px' }} />
                    View Detail
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default Home;
