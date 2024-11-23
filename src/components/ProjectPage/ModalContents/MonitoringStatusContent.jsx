import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { MonitoringOptions } from '../../../constants/MonitoringOptions';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

export const MonitoringStatusContent = ({
  existDevices,
  monitorDevices,
  setMonitorDevices,
  monitorDeviceOption,
  setMonitorDeviceOption,
  closeModal,
}) => {
  const [selectedDevices, setSelectedDevices] = useState(monitorDevices);
  const [selectedOption, setSelectedOption] = useState(monitorDeviceOption);
  const gridRef = useRef();

  const [columnDefs, setColumnDefs] = useState([
    { headerName: '장비명', valueGetter: (p) => p.data, flex: 1 },
  ]);

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setSelectedDevices(selectedRows);
  });

  const onFirstDataRendered = (params) => {
    const nodesToSelect = [];
    params.api.forEachNode((node) => {
      if (selectedDevices.includes(node.data)) {
        nodesToSelect.push(node);
      }
    });
    params.api.setNodesSelected({ nodes: nodesToSelect, newValue: true });
  };

  const rowSelection = useMemo(() => {
    return {
      mode: 'multiRow',
      selectAll: 'filtered',
      headerCheckbox: true,
    };
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      enableClickSelection: true,
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMonitorDevices(selectedDevices);
    setMonitorDeviceOption(selectedOption);
    closeModal();
  };

  return (
    <form className="form-in-sidebar" onSubmit={handleSubmit}>
      <h3 className="monitoring-option-title">모니터링 옵션</h3>
      <div className="form-group">
        <select
          id="monitoring-status-option-select"
          onChange={(event) => {
            setSelectedOption(event.target.value);
          }}
          defaultValue={monitorDeviceOption}
        >
          {Object.keys(MonitoringOptions).map((item, idx) => {
            return (
              <option value={item} key={idx}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <h3 className="monitoring-option-title">장비 선택</h3>
      <div
        className="ag-theme-quartz-dark ag-theme-load-device"
        style={{ height: 400 }}
      >
        <AgGridReact
          rowData={existDevices}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
          pagination={true}
          paginationPageSize={5}
          paginationPageSizeSelector={[5, 10, 25, 50]}
          onSelectionChanged={onSelectionChanged}
          onFirstDataRendered={onFirstDataRendered}
          ref={gridRef}
        />
      </div>
      <div className="form-actions">
        <button type="submit">확인</button>
      </div>
    </form>
  );
};
