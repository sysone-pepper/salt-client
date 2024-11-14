import Table from '../Sidebar/Table';

const data = [
  {
    deviceAlias: '대충 개쩌는 장비',
    device_name: 'MGMT01',
    ip: '10.10.100.203',
    device_identifier: '48:FD:8E:48:00:06',
  },
  {
    deviceAlias: '대충 개쩌는 장비',
    device_name: 'MGMT02',
    ip: '10.10.100.204',
    device_identifier: '48:FD:8E:48:00:0B',
  },
  {
    deviceAlias: '대충 개쩌는 장비',
    device_name: 'MGR01',
    ip: '10.10.100.205',
    device_identifier: '00:15:5D:FD:CB:14',
  },
  {
    deviceAlias: '대충 개쩌는 장비',
    device_name: 'MGR02',
    ip: '10.10.100.206',
    device_identifier: '00:15:5D:FD:CB:0D',
  },
  {
    deviceAlias: '대충 개쩌는 장비',
    device_name: 'vdi node1',
    ip: '10.50.10.210',
    device_identifier: '10.50.10.210',
  },
  {
    deviceAlias: '대충 개쩌는 장비',
    device_name: 'vdi node2',
    ip: '10.50.10.212',
    device_identifier: '10.50.10.212',
  },
  {
    deviceAlias: '대충 개쩌는 장비',
    device_name: '백업용 빗맹 스토리지',
    ip: '10.50.10.76',
    device_identifier: '10.50.10.76',
  },
];

const deviceTraffic = {
  title: '구성도 내 장비 목록',
  data: data,
  columnAliases: ['별칭', '장비 명', 'IP', '장비 식별자'],
};

const ChooseDeviceContent = ({ closemodal }) => {
  return (
    <div>
      <Table source={deviceTraffic}></Table>
    </div>
  );
};

export default ChooseDeviceContent;
