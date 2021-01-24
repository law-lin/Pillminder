import React, { useState, useRef, useCallback } from 'react';
import { Space, Input, Upload, Button, Steps, Select } from 'antd';
import { AiOutlineInbox } from 'react-icons/ai';
import Webcam from 'react-webcam';
import firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';

const { Dragger } = Upload;
const { Step } = Steps;
const { Option } = Select;

const ImageSelector = ({ onUpload }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const file = new File([blob], 'unknown.png', { type: 'image/png' });
    // let formData = new FormData();
    // formData.append('image', file)
    // const response = await fetch(uploadUrl, {
    //   method: 'POST',
    //   body: formData,
    // });
    onUpload(file);
  }, [webcamRef]);

  return (
    <Space direction='horizontal'>
      <div style={{ height: '450px' }}>
        <h2>Upload Prescription Image</h2>

        <div style={{ height: 375 }}>
          <Dragger
            name='file'
            multiple={false}
            style={{ width: '500px' }}
            beforeUpload={(file) => onUpload(file)}
          >
            <AiOutlineInbox />
            <p>Click or drag file to this area to upload</p>
          </Dragger>
        </div>
      </div>
      <span style={{ fontSize: 24, fontWeight: 700 }}>OR</span>
      <div>
        <h2>Take Photo With Camera</h2>
        <Webcam
          audio={false}
          ref={webcamRef}
          width={500}
          style={{ display: 'flex', alignSelf: 'center' }}
        />
        <Button onClick={capture}>Take Photo</Button>
      </div>
    </Space>
  );
};

const steps = [
  {
    title: 'Upload',
    content: <ImageSelector />,
  },
  {
    title: 'Details',
    content: (
      <div>
        <h3>Reminder Title</h3>
        <Input />
        <h3>Notification Setting</h3>
        <Select defaultValue='both' style={{ width: 170 }}>
          <Option value='both'>SMS and Phone Call</Option>
          <Option value='sms'>SMS only</Option>
          <Option value='phone'>Phone Call only</Option>
        </Select>
      </div>
    ),
  },
];

function CreateReminderPage() {
  const [imageSrc, setImageSrc] = useState('');
  const [title, setTitle] = useState('');
  const [notificationSetting, setNotificationSetting] = useState('');
  const [current, setCurrent] = useState(0);
  const history = useHistory();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleNotificationSettingChange = (value) => {
    setNotificationSetting(value);
  };

  const handleCreate = async () => {
    await firebase.storage().ref(imageSrc.name).put(imageSrc);
    const url = await firebase.storage().ref(imageSrc.name).getDownloadURL();
    await firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('reminders')
      .add({
        title,
        notificationSetting,
        photoUrl: url,
      });
    history.push('/dashboard');
  };
  return (
    <div style={{ textAlign: 'center' }}>
      <Space direction='vertical'>
        <h1>Create New Reminder</h1>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div style={{ width: '1050px' }}>
          {current === 0 && (
            <ImageSelector
              onUpload={(image) => {
                setImageSrc(image);
                setCurrent(current + 1);
                console.log(image);
              }}
            />
          )}
          {current === 1 && (
            <>
              <h3>Reminder Title</h3>
              <Input style={{ width: '30%' }} onChange={handleTitleChange} />
              <h3>Notification Setting</h3>
              <Select
                defaultValue='both'
                style={{ width: 170 }}
                onChange={handleNotificationSettingChange}
              >
                <Option value='both'>SMS and Phone Call</Option>
                <Option value='sms'>SMS only</Option>
                <Option value='phone'>Phone Call only</Option>
              </Select>
            </>
          )}
        </div>
        <div>
          {current < steps.length - 1 && (
            <Button onClick={() => setCurrent(current + 1)}>Next</Button>
          )}
          {current > 0 && (
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => setCurrent(current - 1)}
            >
              Previous
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type='primary' onClick={handleCreate}>
              Done
            </Button>
          )}
        </div>
      </Space>
    </div>
  );
}

export default CreateReminderPage;
