<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister, faChartLine, faCloudUploadAlt, faPlus, faRocket, faTasks, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown, ButtonGroup, Card, ListGroup, ProgressBar } from '@themesberg/react-bootstrap';

import { CounterWidget, CircleChartWidget, BarChartWidget, TeamMembersWidget, ProgressTrackWidget, RankingWidget, SalesValueWidget, SalesValueWidgetPhone, AcquisitionWidget } from "../../components/Widgets";
import { BarChart } from "../../components/Charts";
import { PageVisitsTable } from "../../components/Tables";
import { trafficShares, totalOrders } from "../../data/charts";
import { BACKEND_URL } from "../../api/config";

export default () => {
  const API_URL = `${BACKEND_URL}/api`;
  const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = (user && (user.access_token || user.token || user.accessToken)) || localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const [loading, setLoading] = useState(true);
  const [commands, setCommands] = useState([]);
  const [monthlySales, setMonthlySales] = useState({ labels: [], series: [] });
  const [weeklySales, setWeeklySales] = useState({ labels: [], series: [] });
  const [topProducts, setTopProducts] = useState([]); // [{name, qty}]
  const [topUsers, setTopUsers] = useState([]); // [{name, count}]
  const [thisMonthValue, setThisMonthValue] = useState(0);
  const [thisWeekValue, setThisWeekValue] = useState(0);
  const [monthDeltaPct, setMonthDeltaPct] = useState(0);
  const [weekDeltaPct, setWeekDeltaPct] = useState(0);

  const startOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay(); // 0 Sun ... 6 Sat
    const diff = (day === 0 ? -6 : 1) - day; // make Monday start
    date.setDate(date.getDate() + diff);
    date.setHours(0,0,0,0);
    return date;
  };

  const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  const weekKey = (d) => {
    const monday = startOfWeek(d);
    const onejan = new Date(monday.getFullYear(), 0, 1);
    const millisInDay = 24*60*60*1000;
    const week = Math.ceil((((monday - onejan) / millisInDay) + onejan.getDay()+1) / 7);
    return `${monday.getFullYear()}-W${String(week).padStart(2,'0')}`;
  };

  const formatMonthLabel = (key) => {
    const [y,m] = key.split('-');
    const date = new Date(Number(y), Number(m)-1, 1);
    return date.toLocaleString(undefined, { month: 'short' });
  };

  const formatWeekLabel = (key) => key.split('-W')[1];

  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const res = await axios.get(`${API_URL}/commands`, { headers: getAuthHeaders() });
        const list = Array.isArray(res.data) ? res.data : [];
        setCommands(list);

        // Aggregations
        const now = new Date();
        const currentMonthKey = monthKey(now);
        const currentWeekKey = weekKey(now);

        // Top products
        const prodMap = new Map();
        list.forEach(cmd => {
          const lines = cmd.command_products || cmd.commandProducts || [];
          lines.forEach(cp => {
            const qty = Number(cp.quantity) || 0;
            const name = cp.product?.name || `#${cp.product_id}`;
            prodMap.set(name, (prodMap.get(name) || 0) + qty);
          });
        });
        const prodArr = Array.from(prodMap.entries()).map(([name, qty]) => ({ name, qty })).sort((a,b)=>b.qty-a.qty).slice(0,5);
        setTopProducts(prodArr);

        // Top users by number of commands
        const userMap = new Map();
        list.forEach(cmd => {
          const uid = cmd.user?.id || null;
          const uname = cmd.user?.name || 'Guest';
          const key = uid ? `${uid}|${uname}` : `guest|${uname}`;
          userMap.set(key, (userMap.get(key) || 0) + 1);
        });
        const usersArr = Array.from(userMap.entries()).map(([k, count]) => ({ name: k.split('|')[1], count })).sort((a,b)=>b.count-a.count).slice(0,5);
        setTopUsers(usersArr);

        // Sales by month (last 12 months)
        const months = [];
        const monthTotals = {};
        for (let i=11;i>=0;i--) {
          const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
          const mk = monthKey(d);
          months.push(mk);
          monthTotals[mk] = 0;
        }
        list.forEach(cmd => {
          const d = cmd.placed_at ? new Date(cmd.placed_at) : null;
          if (!d || isNaN(d)) return;
          const mk = monthKey(d);
          if (mk in monthTotals) monthTotals[mk] += Number(cmd.total) || 0;
        });
        const monthLabels = months.map(formatMonthLabel);
        const monthSeries = months.map(k => Math.round(monthTotals[k]));
        setMonthlySales({ labels: monthLabels, series: [monthSeries] });

        const thisMonth = monthTotals[currentMonthKey] || 0;
        const prevMonthIdx = months.indexOf(currentMonthKey) - 1;
        const prevMonth = prevMonthIdx >= 0 ? monthTotals[months[prevMonthIdx]] : 0;
        setThisMonthValue(Math.round(thisMonth));
        setMonthDeltaPct(prevMonth ? Math.round(((thisMonth - prevMonth) / prevMonth) * 100) : 0);

        // Sales by week (last 8 weeks)
        const weekKeys = [];
        const weekTotals = {};
        let cursor = startOfWeek(now);
        for (let i=7;i>=0;i--) {
          const d = new Date(cursor);
          d.setDate(cursor.getDate() - (i*7));
          const wk = weekKey(d);
          weekKeys.push(wk);
          weekTotals[wk] = 0;
        }
        list.forEach(cmd => {
          const d = cmd.placed_at ? new Date(cmd.placed_at) : null;
          if (!d || isNaN(d)) return;
          const wk = weekKey(d);
          if (wk in weekTotals) weekTotals[wk] += Number(cmd.total) || 0;
        });
        const weekLabels = weekKeys.map(formatWeekLabel);
        const weekSeries = weekKeys.map(k => Math.round(weekTotals[k]));
        setWeeklySales({ labels: weekLabels, series: [weekSeries] });

        const thisWeek = weekTotals[currentWeekKey] || 0;
        const prevWeekIdx = weekKeys.indexOf(currentWeekKey) - 1;
        const prevWeek = prevWeekIdx >= 0 ? weekTotals[weekKeys[prevWeekIdx]] : 0;
        setThisWeekValue(Math.round(thisWeek));
        setWeekDeltaPct(prevWeek ? Math.round(((thisWeek - prevWeek) / prevWeek) * 100) : 0);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommands();
  }, []);

  return (
    <>


      {/* Real stats section */}


      <Row className="mb-4">
        <Col xs={12} xl={6} className="mb-4">
          <Card border="light" className="shadow-sm h-100">
            <Card.Header>
              <h6 className="mb-0">Sales by Week</h6>
              <small className="text-muted">last 8 weeks</small>
            </Card.Header>
            <Card.Body className="p-2">
              <BarChart labels={weeklySales.labels} series={weeklySales.series} />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} xl={3} className="mb-4">
          <Card border="light" className="shadow-sm h-100">
            <Card.Header><h6 className="mb-0">Top Products</h6></Card.Header>
            <ListGroup variant="flush">
              {topProducts.length === 0 && <ListGroup.Item className="text-muted">No data</ListGroup.Item>}
              {topProducts.map((p, idx) => (
                <ListGroup.Item key={idx} className="d-flex align-items-center justify-content-between">
                  <span className="text-truncate" title={p.name}>{p.name}</span>
                  <span className="badge bg-primary">{p.qty}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        <Col xs={12} xl={3} className="mb-4">
          <Card border="light" className="shadow-sm h-100">
            <Card.Header><h6 className="mb-0">Top Customers</h6></Card.Header>
            <ListGroup variant="flush">
              {topUsers.length === 0 && <ListGroup.Item className="text-muted">No data</ListGroup.Item>}
              {topUsers.map((u, idx) => (
                <ListGroup.Item key={idx} className="d-flex align-items-center justify-content-between">
                  <span className="text-truncate" title={u.name}>{u.name}</span>
                  <span className="badge bg-secondary">{u.count}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={12} sm={6} xl={3} className="mb-4">
          <CounterWidget
            category="Sales This Month"
            title={`${thisMonthValue}`}
            period={new Date().toLocaleString(undefined, { month: 'long', year: 'numeric' })}
            percentage={monthDeltaPct}
            icon={faCashRegister}
            iconColor="shape-tertiary"
          />
        </Col>
        <Col xs={12} sm={6} xl={3} className="mb-4">
          <CounterWidget
            category="Sales This Week"
            title={`${thisWeekValue}`}
            period={`Week ${weeklySales.labels[weeklySales.labels.length-1] || ''}`}
            percentage={weekDeltaPct}
            icon={faChartLine}
            iconColor="shape-secondary"
          />
        </Col>
        <Col xs={12} xl={6} className="mb-4">
          <Card border="light" className="shadow-sm h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Sales by Month</h6>
              <small className="text-muted">last 12 months</small>
            </Card.Header>
            <Card.Body className="p-2">
              <BarChart labels={monthlySales.labels} series={monthlySales.series} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-none d-sm-block">
          <SalesValueWidget
            title="Sales Value"
            value="10,567"
            percentage={10.57}
          />
        </Col>
        <Col xs={12} className="mb-4 d-sm-none">
          <SalesValueWidgetPhone
            title="Sales Value"
            value="10,567"
            percentage={10.57}
          />
        </Col>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Customers"
            title="345k"
            period="Feb 1 - Apr 1"
            percentage={18.2}
            icon={faChartLine}
            iconColor="shape-secondary"
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Revenue"
            title="$43,594"
            period="Feb 1 - Apr 1"
            percentage={28.4}
            icon={faCashRegister}
            iconColor="shape-tertiary"
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CircleChartWidget
            title="Traffic Share"
            data={trafficShares} />
        </Col>
      </Row> */}
{/* 
      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <Row>
            <Col xs={12} xl={8} className="mb-4">
              <Row>
                <Col xs={12} className="mb-4">
                  <PageVisitsTable />
                </Col>

                <Col xs={12} lg={6} className="mb-4">
                  <TeamMembersWidget />
                </Col>

                <Col xs={12} lg={6} className="mb-4">
                  <ProgressTrackWidget />
                </Col>
              </Row>
            </Col>

            <Col xs={12} xl={4}>
              <Row>
                <Col xs={12} className="mb-4">
                  <BarChartWidget
                    title="Total orders"
                    value={452}
                    percentage={18.2}
                    data={totalOrders} />
                </Col>

                <Col xs={12} className="px-0 mb-4">
                  <RankingWidget />
                </Col>

                <Col xs={12} className="px-0">
                  <AcquisitionWidget />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row> */}
    </>
  );
};
=======
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister, faChartLine, faCloudUploadAlt, faPlus, faRocket, faTasks, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown, ButtonGroup, Card, ListGroup, ProgressBar } from '@themesberg/react-bootstrap';

import { CounterWidget, CircleChartWidget, BarChartWidget, TeamMembersWidget, ProgressTrackWidget, RankingWidget, SalesValueWidget, SalesValueWidgetPhone, AcquisitionWidget } from "../../components/Widgets";
import { BarChart } from "../../components/Charts";
import { PageVisitsTable } from "../../components/Tables";
import { trafficShares, totalOrders } from "../../data/charts";
import { BACKEND_URL } from "../../api/config";

export default () => {
  const API_URL = `${BACKEND_URL}/api`;
  const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = (user && (user.access_token || user.token || user.accessToken)) || localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const [loading, setLoading] = useState(true);
  const [commands, setCommands] = useState([]);
  const [monthlySales, setMonthlySales] = useState({ labels: [], series: [] });
  const [weeklySales, setWeeklySales] = useState({ labels: [], series: [] });
  const [topProducts, setTopProducts] = useState([]); // [{name, qty}]
  const [topUsers, setTopUsers] = useState([]); // [{name, count}]
  const [thisMonthValue, setThisMonthValue] = useState(0);
  const [thisWeekValue, setThisWeekValue] = useState(0);
  const [monthDeltaPct, setMonthDeltaPct] = useState(0);
  const [weekDeltaPct, setWeekDeltaPct] = useState(0);

  const startOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay(); // 0 Sun ... 6 Sat
    const diff = (day === 0 ? -6 : 1) - day; // make Monday start
    date.setDate(date.getDate() + diff);
    date.setHours(0,0,0,0);
    return date;
  };

  const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  const weekKey = (d) => {
    const monday = startOfWeek(d);
    const onejan = new Date(monday.getFullYear(), 0, 1);
    const millisInDay = 24*60*60*1000;
    const week = Math.ceil((((monday - onejan) / millisInDay) + onejan.getDay()+1) / 7);
    return `${monday.getFullYear()}-W${String(week).padStart(2,'0')}`;
  };

  const formatMonthLabel = (key) => {
    const [y,m] = key.split('-');
    const date = new Date(Number(y), Number(m)-1, 1);
    return date.toLocaleString(undefined, { month: 'short' });
  };

  const formatWeekLabel = (key) => key.split('-W')[1];

  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const res = await axios.get(`${API_URL}/commands`, { headers: getAuthHeaders() });
        const list = Array.isArray(res.data) ? res.data : [];
        setCommands(list);

        // Aggregations
        const now = new Date();
        const currentMonthKey = monthKey(now);
        const currentWeekKey = weekKey(now);

        // Top products
        const prodMap = new Map();
        list.forEach(cmd => {
          const lines = cmd.command_products || cmd.commandProducts || [];
          lines.forEach(cp => {
            const qty = Number(cp.quantity) || 0;
            const name = cp.product?.name || `#${cp.product_id}`;
            prodMap.set(name, (prodMap.get(name) || 0) + qty);
          });
        });
        const prodArr = Array.from(prodMap.entries()).map(([name, qty]) => ({ name, qty })).sort((a,b)=>b.qty-a.qty).slice(0,5);
        setTopProducts(prodArr);

        // Top users by number of commands
        const userMap = new Map();
        list.forEach(cmd => {
          const uid = cmd.user?.id || null;
          const uname = cmd.user?.name || 'Guest';
          const key = uid ? `${uid}|${uname}` : `guest|${uname}`;
          userMap.set(key, (userMap.get(key) || 0) + 1);
        });
        const usersArr = Array.from(userMap.entries()).map(([k, count]) => ({ name: k.split('|')[1], count })).sort((a,b)=>b.count-a.count).slice(0,5);
        setTopUsers(usersArr);

        // Sales by month (last 12 months)
        const months = [];
        const monthTotals = {};
        for (let i=11;i>=0;i--) {
          const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
          const mk = monthKey(d);
          months.push(mk);
          monthTotals[mk] = 0;
        }
        list.forEach(cmd => {
          const d = cmd.placed_at ? new Date(cmd.placed_at) : null;
          if (!d || isNaN(d)) return;
          const mk = monthKey(d);
          if (mk in monthTotals) monthTotals[mk] += Number(cmd.total) || 0;
        });
        const monthLabels = months.map(formatMonthLabel);
        const monthSeries = months.map(k => Math.round(monthTotals[k]));
        setMonthlySales({ labels: monthLabels, series: [monthSeries] });

        const thisMonth = monthTotals[currentMonthKey] || 0;
        const prevMonthIdx = months.indexOf(currentMonthKey) - 1;
        const prevMonth = prevMonthIdx >= 0 ? monthTotals[months[prevMonthIdx]] : 0;
        setThisMonthValue(Math.round(thisMonth));
        setMonthDeltaPct(prevMonth ? Math.round(((thisMonth - prevMonth) / prevMonth) * 100) : 0);

        // Sales by week (last 8 weeks)
        const weekKeys = [];
        const weekTotals = {};
        let cursor = startOfWeek(now);
        for (let i=7;i>=0;i--) {
          const d = new Date(cursor);
          d.setDate(cursor.getDate() - (i*7));
          const wk = weekKey(d);
          weekKeys.push(wk);
          weekTotals[wk] = 0;
        }
        list.forEach(cmd => {
          const d = cmd.placed_at ? new Date(cmd.placed_at) : null;
          if (!d || isNaN(d)) return;
          const wk = weekKey(d);
          if (wk in weekTotals) weekTotals[wk] += Number(cmd.total) || 0;
        });
        const weekLabels = weekKeys.map(formatWeekLabel);
        const weekSeries = weekKeys.map(k => Math.round(weekTotals[k]));
        setWeeklySales({ labels: weekLabels, series: [weekSeries] });

        const thisWeek = weekTotals[currentWeekKey] || 0;
        const prevWeekIdx = weekKeys.indexOf(currentWeekKey) - 1;
        const prevWeek = prevWeekIdx >= 0 ? weekTotals[weekKeys[prevWeekIdx]] : 0;
        setThisWeekValue(Math.round(thisWeek));
        setWeekDeltaPct(prevWeek ? Math.round(((thisWeek - prevWeek) / prevWeek) * 100) : 0);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommands();
  }, []);

  return (
    <>


      {/* Real stats section */}


      <Row className="mb-4">
        <Col xs={12} xl={6} className="mb-4">
          <Card border="light" className="shadow-sm h-100">
            <Card.Header>
              <h6 className="mb-0">Sales by Week</h6>
              <small className="text-muted">last 8 weeks</small>
            </Card.Header>
            <Card.Body className="p-2">
              <BarChart labels={weeklySales.labels} series={weeklySales.series} />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} xl={3} className="mb-4">
          <Card border="light" className="shadow-sm h-100">
            <Card.Header><h6 className="mb-0">Top Products</h6></Card.Header>
            <ListGroup variant="flush">
              {topProducts.length === 0 && <ListGroup.Item className="text-muted">No data</ListGroup.Item>}
              {topProducts.map((p, idx) => (
                <ListGroup.Item key={idx} className="d-flex align-items-center justify-content-between">
                  <span className="text-truncate" title={p.name}>{p.name}</span>
                  <span className="badge bg-primary">{p.qty}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        <Col xs={12} xl={3} className="mb-4">
          <Card border="light" className="shadow-sm h-100">
            <Card.Header><h6 className="mb-0">Top Customers</h6></Card.Header>
            <ListGroup variant="flush">
              {topUsers.length === 0 && <ListGroup.Item className="text-muted">No data</ListGroup.Item>}
              {topUsers.map((u, idx) => (
                <ListGroup.Item key={idx} className="d-flex align-items-center justify-content-between">
                  <span className="text-truncate" title={u.name}>{u.name}</span>
                  <span className="badge bg-secondary">{u.count}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={12} sm={6} xl={3} className="mb-4">
          <CounterWidget
            category="Sales This Month"
            title={`${thisMonthValue}`}
            period={new Date().toLocaleString(undefined, { month: 'long', year: 'numeric' })}
            percentage={monthDeltaPct}
            icon={faCashRegister}
            iconColor="shape-tertiary"
          />
        </Col>
        <Col xs={12} sm={6} xl={3} className="mb-4">
          <CounterWidget
            category="Sales This Week"
            title={`${thisWeekValue}`}
            period={`Week ${weeklySales.labels[weeklySales.labels.length-1] || ''}`}
            percentage={weekDeltaPct}
            icon={faChartLine}
            iconColor="shape-secondary"
          />
        </Col>
        <Col xs={12} xl={6} className="mb-4">
          <Card border="light" className="shadow-sm h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Sales by Month</h6>
              <small className="text-muted">last 12 months</small>
            </Card.Header>
            <Card.Body className="p-2">
              <BarChart labels={monthlySales.labels} series={monthlySales.series} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-none d-sm-block">
          <SalesValueWidget
            title="Sales Value"
            value="10,567"
            percentage={10.57}
          />
        </Col>
        <Col xs={12} className="mb-4 d-sm-none">
          <SalesValueWidgetPhone
            title="Sales Value"
            value="10,567"
            percentage={10.57}
          />
        </Col>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Customers"
            title="345k"
            period="Feb 1 - Apr 1"
            percentage={18.2}
            icon={faChartLine}
            iconColor="shape-secondary"
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Revenue"
            title="$43,594"
            period="Feb 1 - Apr 1"
            percentage={28.4}
            icon={faCashRegister}
            iconColor="shape-tertiary"
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CircleChartWidget
            title="Traffic Share"
            data={trafficShares} />
        </Col>
      </Row> */}
{/* 
      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <Row>
            <Col xs={12} xl={8} className="mb-4">
              <Row>
                <Col xs={12} className="mb-4">
                  <PageVisitsTable />
                </Col>

                <Col xs={12} lg={6} className="mb-4">
                  <TeamMembersWidget />
                </Col>

                <Col xs={12} lg={6} className="mb-4">
                  <ProgressTrackWidget />
                </Col>
              </Row>
            </Col>

            <Col xs={12} xl={4}>
              <Row>
                <Col xs={12} className="mb-4">
                  <BarChartWidget
                    title="Total orders"
                    value={452}
                    percentage={18.2}
                    data={totalOrders} />
                </Col>

                <Col xs={12} className="px-0 mb-4">
                  <RankingWidget />
                </Col>

                <Col xs={12} className="px-0">
                  <AcquisitionWidget />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row> */}
    </>
  );
};
>>>>>>> origin/main
