import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import './LoadDeviceForm.css';
import { NetworkContext } from '../../../contexts/NetworkContext';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

const rowSelection = {
  mode: 'singleRow',
  headerCheckbox: false,
};

export const LoadDeviceForm = ({ closeModal }) => {
  const {
    fetchExistDeviceInfo,
    existDevices,
    curProjectId,
    createNodeId,
    nodes,
    setNodes,
    selectedSize,
  } = useContext(NetworkContext);
  const [dataReady, setDataReady] = useState(false);
  const gridRef = useRef();
  const [selectedDevice, setSelectedDevice] = useState(null);

  // AGgrid 라이브러리 설정
  const [columnDefs, setColumnDefs] = useState([
    // 칼럼명 정의 및 데이터 설정
    { headerName: 'ID', valueGetter: (p) => p.data.id, flex: 1 },
    { headerName: '장비명', valueGetter: (p) => p.data.deviceName, flex: 2 },
    {
      headerName: '장비 별칭',
      valueGetter: (p) => p.data.deviceAlias,
      flex: 1,
    },
    { headerName: '장비 타입', valueGetter: (p) => p.data.deviceType, flex: 1 },
    { headerName: 'IP', valueGetter: (p) => p.data.publicIp, flex: 1 },
  ]);

  const onSelectionChanged = useCallback(() => {
    // 체크박스를 선택할 경우의 작업 설정
    const seletedRows = gridRef.current.api.getSelectedRows();
    setSelectedDevice(seletedRows[0]);
  });

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    };
  }, []);

  // 실장비 데이터 로드
  useEffect(() => {
    fetchExistDeviceInfo();
  }, []);

  // 실장비 데이터 로드 이후, 장비 카드 생성
  useEffect(() => {
    setDataReady(true);
    console.log(existDevices);
  }, [existDevices]);

  const handleLoadDeviceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDevice) {
      alert('장비를 선택해주세요!');
    }

    const newNodeData = {
      nodeType: 'EXIST_DEVICE',
      positionX: 0,
      positionY: 0,
      nodeSize: selectedSize,
      deviceId: selectedDevice.id,
      ...selectedDevice,
    };

    delete newNodeData.id;

    let nodeId = await createNodeId(newNodeData);

    let newNode = {
      group: 'nodes',
      data: {
        id: nodeId,
        nodeId,
        projectId: curProjectId,
        ...newNodeData,
      },
      position: { x: newNodeData.positionX, y: newNodeData.positionY },
      style: { width: newNodeData.nodeSize, height: newNodeData.nodeSize },
      classes: `object ${newNodeData.nodeType + ' noControlsMode'}`,
      grabbable: true,
    };

    delete newNode.data.positionX;
    delete newNode.data.positionY;

    setNodes([...nodes, newNode]);
    closeModal();
  };

  return (
    <>
      <div className="ag-theme-quartz" style={{ height: 400 }}>
        <AgGridReact
          rowData={existDevices}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          onSelectionChanged={onSelectionChanged}
          ref={gridRef}
        />
      </div>
      <form className="load-device-form" onSubmit={handleLoadDeviceSubmit}>
        <div className="form-actions">
          <button type="submit">적용</button>
        </div>
      </form>
    </>
  );
};
