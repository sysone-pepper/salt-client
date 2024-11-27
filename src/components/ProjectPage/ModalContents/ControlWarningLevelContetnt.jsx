import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate } from 'react-router-dom';
import { NetworkContext } from '../../../contexts/NetworkContext';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { updateNodeThreshold } from '../../../api/Diagram';

export const ControlWarningLevelContent = ({ data, closeModal }) => {
  const { nodes, setNodes, frequency, setFrequency } =
    useContext(NetworkContext);
  const { theme } = useContext(ThemeContext);
  const [inputValue, setInputValue] = useState(frequency);
  const [gridData, setGridData] = useState([]); // 초기 데이터

  useEffect(() => {
    const newGridData = Object.entries(data).map(([deviceName, values]) => ({
      장비명: deviceName,
      trafficWarning: values.traffic[0],
      trafficDanger: values.traffic[1],
      cpuWarning: values.cpu[0],
      cpuDanger: values.cpu[1],
      memWarning: values.mem[0],
      memDanger: values.mem[1],
      diskWarning: values.disk[0],
      diskDanger: values.disk[1],
      id: values.id[0],
    }));

    setGridData(newGridData);
  }, []);

  // 컬럼 정의
  const columnDefs = useMemo(
    () => [
      {
        field: '장비명',
        headerName: '장비명',
        editable: false,
        filter: true,
        flex: 1.5,
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'Traffic',
        children: [
          {
            field: 'trafficDanger',
            headerName: '위험레벨',
            editable: true,
            type: 'numericColumn',
          },
          {
            field: 'trafficWarning',
            headerName: '경고레벨',
            editable: true,
            type: 'numericColumn',
          },
        ],
      },
      {
        headerName: 'CPU',
        children: [
          {
            field: 'cpuDanger',
            headerName: '위험레벨',
            editable: true,
            type: 'numericColumn',
          },
          {
            field: 'cpuWarning',
            headerName: '경고레벨',
            editable: true,
            type: 'numericColumn',
          },
        ],
      },
      {
        headerName: 'MEM',
        children: [
          {
            field: 'memDanger',
            headerName: '위험레벨',
            editable: true,
            type: 'numericColumn',
          },
          {
            field: 'memWarning',
            headerName: '경고레벨',
            editable: true,
            type: 'numericColumn',
          },
        ],
      },
      {
        headerName: 'DISK',
        children: [
          {
            field: 'diskDanger',
            headerName: '위험레벨',
            editable: true,
            type: 'numericColumn',
          },
          {
            field: 'diskWarning',
            headerName: '경고레벨',
            editable: true,
            type: 'numericColumn',
          },
        ],
      },
    ],
    [],
  );

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      sortable: true,
      resizable: true,
      cellStyle: { 'text-align': 'right' },
    }),
    [],
  );

  const updateRowData = async (updatedData) => {
    const res = await updateNodeThreshold(updatedData);
    if (res.success) {
      const newNodes = [...nodes].map((node) => {
        if (node.data.id === updatedData.id) {
          node.data = { ...node.data, ...updatedData };
          // console.log(node.data);
        }
        return node;
      });

      setNodes(newNodes);
    }
  };
  const onRowEditingStopped = (event) => {
    const updatedData = event.data; // 수정된 행의 데이터
    // console.log('Edited Row Data:', updatedData);
    updateRowData(updatedData);
  };

  const onClick = () => {
    setFrequency(inputValue);
    alert('변경되었습니다.');
    closeModal();
  };

  const handleSizeInputChange = (e) => {
    const newInputValue = Number(e.target.value);
    setInputValue(newInputValue);
  };

  return (
    <>
      <h3 className="monitoring-option-title">장비 모니터링 주기 설정</h3>
      <input
        id="sizeInput"
        type="number"
        min="1"
        max="3600"
        value={inputValue}
        onChange={handleSizeInputChange}
        placeholder="1초 ~ 3600초 "
      />

      <h3 className="monitoring-option-title">장비 모니터링 수치 설정</h3>
      <div
        className={`ag-theme-quartz${
          theme === 'dark' ? '-dark' : ''
        } ag-theme-load-device`}
        style={{ height: 400, paddingTop: 20 }}
      >
        <AgGridReact
          rowData={gridData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          onRowEditingStopped={onRowEditingStopped}
          editType="fullRow"
        />
      </div>
      <div className="form-actions">
        <button onClick={onClick}>적용</button>
      </div>
    </>
  );
};
