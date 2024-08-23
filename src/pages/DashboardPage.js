import React, { useEffect, useState } from 'react';
import { useAuth } from '../services/auth';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
} from '@mui/material';

const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user && user.id) {
        try {
          // Fetch all tasks and projects for admin view
          if (user.uloga === 'admin') {
            const tasksResponse = await axios.get('http://localhost:5000/api/tasks');
            const projectsResponse = await axios.get('http://localhost:5000/api/projekti');
            const usersResponse = await axios.get('http://localhost:5000/api/users');

            setTasks(tasksResponse.data);
            setProjects(projectsResponse.data);
            setAllUsers(usersResponse.data);
          } else {
            // Fetch user-specific data for non-admin users
            const tasksResponse = await axios.get(`http://localhost:5000/api/tasks?korisnik_id=${user.id}`);
            const projectsResponse = await axios.get(`http://localhost:5000/api/projects?korisnik_id=${user.id}`);
            setTasks(tasksResponse.data);
            setProjects(projectsResponse.data);
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      }
    };

    fetchDashboardData();
  }, [user]);

/*   const getTasksCountByStatus = (status) => {
    return tasks.filter(task => task.status === status).length;
  }; */

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>Zdravo, {user.ime}!</p>

      <Grid container spacing={3}>
        {/* Admin Dashboard */}
        {user.uloga === 'admin' && (
          <Grid item xs={12}>
            <Typography variant="h6">Admin Panel</Typography>

            {/* All Tasks */}
            <Typography variant="h6" style={{ marginTop: '20px' }}>Svi Zadaci</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Ime zadatka</TableCell>
                    <TableCell>Opis</TableCell>
                    <TableCell>Korisnik ID</TableCell>
                    <TableCell>Projekat ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Rok</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.id}</TableCell>
                      <TableCell>{task.naziv}</TableCell>
                      <TableCell>{task.opis}</TableCell>
                      <TableCell>{task.korisnik_id}</TableCell>
                      <TableCell>{task.projekat_id}</TableCell>
                      <TableCell>{task.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* All Projects */}
            <Typography variant="h6" style={{ marginTop: '20px' }}>Svi Projekti</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Ime projekta</TableCell>
                    <TableCell>Opis</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Rok</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.id}</TableCell>
                      <TableCell>{project.ime_projekta}</TableCell>
                      <TableCell>{project.opis}</TableCell>
                      <TableCell>{project.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* All Users */}
            <Typography variant="h6" style={{ marginTop: '20px' }}>Svi Korisnici</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Ime</TableCell>
                    <TableCell>Prezime</TableCell>
                    <TableCell>Uloga</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.ime}</TableCell>
                      <TableCell>{user.prezime}</TableCell>
                      <TableCell>{user.uloga}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default DashboardPage;
