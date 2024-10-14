import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'];

const AdminDashboard = () => {
  const [productData, setProductData] = useState({ authentic: 0, counterfeit: 0 });
  const [userActivity, setUserActivity] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [topCounterfeitBrands, setTopCounterfeitBrands] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);

  useEffect(() => {
    // Mock data for prototype
    setProductData({ authentic: 7500, counterfeit: 2500 });
    setUserActivity({ daily: 1200, weekly: 8400, monthly: 36000 });
    setTopCounterfeitBrands([
      { name: 'Brand A', count: 450 },
      { name: 'Brand B', count: 380 },
      { name: 'Brand C', count: 320 },
      { name: 'Brand D', count: 300 },
      { name: 'Brand E', count: 250 },
      { name: 'Brand F', count: 200 },
      { name: 'Brand G', count: 180 },
      { name: 'Brand H', count: 150 },
      { name: 'Brand I', count: 120 },
      { name: 'Brand J', count: 100 },
    ]);
    setTimeSeriesData([
      { date: '2023-01', authentic: 500, counterfeit: 100, users: 2000 },
      { date: '2023-02', authentic: 600, counterfeit: 150, users: 2200 },
      { date: '2023-03', authentic: 700, counterfeit: 200, users: 2400 },
      { date: '2023-04', authentic: 800, counterfeit: 180, users: 2600 },
      { date: '2023-05', authentic: 900, counterfeit: 220, users: 2800 },
      { date: '2023-06', authentic: 1000, counterfeit: 250, users: 3000 },
    ]);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>AuthentiThief</div>
        <nav style={styles.nav}>
          <a href="#" style={styles.navItem}>Dashboard</a>
          <a href="#" style={styles.navItem}>User Activity</a>
          <a href="#" style={styles.navItem}>Product Analytics</a>
          <a href="#" style={styles.navItem}>Counterfeit Analysis</a>
        </nav>
      </div>
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Blockchain Authentication Dashboard</h1>
          <div style={styles.headerControls}>
            <span style={styles.headerItem}>Search</span>
            <span style={styles.headerItem}>Notifications</span>
            <span style={styles.headerItem}>Profile</span>
          </div>
        </header>
        <div style={styles.content}>
          <div style={styles.topRow}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Total Products Registered</h2>
              <p style={styles.cardValue}>{productData.authentic + productData.counterfeit}</p>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={timeSeriesData}>
                  <Line type="monotone" dataKey="authentic" stroke="#3498db" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="counterfeit" stroke="#e74c3c" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Product Authentication Ratio</h2>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Authentic', value: productData.authentic },
                      { name: 'Counterfeit', value: productData.counterfeit }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#3498db" />
                    <Cell fill="#e74c3c" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>User Activity</h2>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={[
                  { period: 'Daily', users: userActivity.daily },
                  { period: 'Weekly', users: userActivity.weekly },
                  { period: 'Monthly', users: userActivity.monthly }
                ]}>
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#2ecc71" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={styles.bottomRow}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Top 10 Counterfeited Brands</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCounterfeitBrands} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3498db">
                    {topCounterfeitBrands.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  sidebar: {
    width: '200px',
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '40px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
  },
  navItem: {
    color: 'white',
    textDecoration: 'none',
    padding: '10px 0',
    fontSize: '16px',
  },
  main: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  headerControls: {
    display: 'flex',
    gap: '20px',
  },
  headerItem: {
    cursor: 'pointer',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  topRow: {
    display: 'flex',
    gap: '20px',
  },
  bottomRow: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flex: 1,
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: '5px',
  },
};

export default AdminDashboard;