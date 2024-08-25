import React, { useEffect, useState } from 'react';
import { useAuth } from '../services/auth';
import axios from 'axios';
import {
  Grid,
  Typography,
  Paper,
} from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [taskData, setTaskData] = useState({ labels: [], datasets: [] });
  const [projectData, setProjectData] = useState({ labels: [], datasets: [] });
  const [userWorkloadData, setUserWorkloadData] = useState({ labels: [], datasets: [] });

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

  useEffect(() => {
    const calculateTaskData = () => {
      if (tasks.length === 0) return;

      const statusCounts = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {});

      setTaskData({
        labels: Object.keys(statusCounts),
        datasets: [
          {
            label: 'Broj zadataka po statusu',
            data: Object.values(statusCounts),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    };

    const calculateProjectData = () => {
      if (projects.length === 0) return;

      const projectStatusCounts = projects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {});

      setProjectData({
        labels: Object.keys(projectStatusCounts),
        datasets: [
          {
            label: 'Broj projekata po statusu',
            data: Object.values(projectStatusCounts),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      });
    };

    const calculateUserWorkloadData = () => {
      if (allUsers.length === 0 || tasks.length === 0) return;

      const userWorkloads = allUsers.reduce((acc, user) => {
        acc[user.ime + ' ' + user.prezime] = tasks.filter(task => task.korisnik_id === user.id).length;
        return acc;
      }, {});

      setUserWorkloadData({
        labels: Object.keys(userWorkloads),
        datasets: [
          {
            label: 'Broj zadataka po korisniku',
            data: Object.values(userWorkloads),
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
          },
        ],
      });
    };

    calculateTaskData();
    calculateProjectData();
    calculateUserWorkloadData();
  }, [tasks, projects, allUsers]);

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

            {/* Tasks by Status */}
            <Typography variant="h6" style={{ margin: '120px' }}>Broj zadataka po statusu</Typography>
            <Paper style={{ padding: '20px' }}>
              <Bar
                data={taskData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Zadaci po statusu',
                    },
                  },
                }}
              />
            </Paper>

            {/* Projects by Status */}
            <Typography variant="h6" style={{ margin: '120px' }}>Broj projekata po statusu</Typography>
            <Paper style={{ padding: '20px' }}>
              <Bar
                data={projectData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Projekti po statusu',
                    },
                  },
                }}
              />
            </Paper>

            {/* User Workload */}
            <Typography variant="h6" style={{ margin: '120px' }}>Opterećenje korisnika</Typography>
            <Paper style={{ padding: '20px' }}>
              <Doughnut
                data={userWorkloadData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Broj zadataka po korisniku',
                    },
                  },
                }}
              />
            </Paper>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default DashboardPage;
