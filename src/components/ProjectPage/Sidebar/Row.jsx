import ServerIcon from '../../../assets/images/Server-icon2.png';
import NetworkIcon from '../../../assets/images/Network-icon2.png';
import L3SwitchIcon from '../../../assets/images/L3Switch-icon.png';
import L4SwitchIcon from '../../../assets/images/L4Switch-icon.png';
import L7SwitchIcon from '../../../assets/images/L7Switch-icon.png';
import FirewallIcon from '../../../assets/images/Firewall-icon2.png';
import UPSIcon from '../../../assets/images/UPS-icon2.png';

const iconLookup = {
  Server: (
    <img className="icon-image" key="ServerImg" src={ServerIcon} alt="" />
  ),
  Network: (
    <img className="icon-image" key="NetworkImg" src={NetworkIcon} alt="" />
  ),
  L2Switch: (
    <img className="icon-image" key="L2SwitchImg" src={L3SwitchIcon} alt="" />
  ),
  L3Switch: (
    <img className="icon-image" key="L3SwitchImg" src={L3SwitchIcon} alt="" />
  ),
  L4Switch: (
    <img className="icon-image" key="L4SwitchImg" src={L4SwitchIcon} alt="" />
  ),
  L7Switch: (
    <img className="icon-image" key="L7SwitchImg" src={L7SwitchIcon} alt="" />
  ),
  FW: (
    <img className="icon-image" key="FirewallImg" src={FirewallIcon} alt="" />
  ),
  UPS: <img className="icon-image" key="UPSImg" src={UPSIcon} alt="" />,
};
const Row = ({ rowData }) => {
  return (
    <tr className="table-row">
      {Object.entries(rowData).map(([key, value]) => {
        return (
          <td key={`${key} field`} className="table-field">
            {iconLookup[value] && iconLookup[value]}
            <span>{value}</span>
          </td>
        );
      })}
    </tr>
  );
};

export default Row;
