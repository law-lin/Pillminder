import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Space } from 'antd';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Details',
    dataIndex: 'details',
    key: 'details',
  },
  {
    title: 'Image',
    dataIndex: 'photoUrl',
    key: 'image',
    render: (photoUrl) => (
      <img style={{ width: '100px', height: '100px' }} src={photoUrl} />
    ),
  },
  {
    title: 'Action',
    key: 'action',
    dataIndex: 'key',
    render: (key) => (
      <Button
        type='primary'
        danger
        onClick={async () => {
          await firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('reminders')
            .doc(key)
            .delete();

          firebase.storage().ref();
        }}
      >
        Delete
      </Button>
    ),
  },
];
function DashboardPage() {
  const history = useHistory();
  const [data, setData] = useState([]);
  useEffect(async () => {
    const querySnapshot = await firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('reminders')
      .get();

    let data = [];
    querySnapshot.forEach((doc) => {
      data.push(Object.assign({ key: doc.id }, doc.data()));
    });
    setData(data);
  }, []);
  return (
    <div>
      <Row>
        <Col span={8}>
          <Space direction='vertical'>
            <Button onClick={() => history.push('/new-reminder')}>
              Add New Reminder
            </Button>
            <Button onClick={() => firebase.auth().signOut()}>Sign Out</Button>
          </Space>
        </Col>
        <Col span={16}>
          <Table columns={columns} dataSource={data} />
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
