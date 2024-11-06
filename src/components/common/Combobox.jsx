import { useCombobox } from 'downshift';
import './Combobox.css';

const Combobox = ({ label, placeholder, items, onSelect }) => {
  const {
    isOpen,
    highlightedIndex,
    getLabelProps,
    getInputProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  } = useCombobox({
    items: items,
    onSelectedItemChange: ({ selectedItem }) => {
      onSelect(selectedItem);
    },
  });

  return (
    <>
      <label className="dd-label" {...getLabelProps()}>
        {label}
      </label>
      <div className="dd-div">
        <input
          className="dd-input"
          readOnly
          placeholder={placeholder}
          {...getInputProps()}
        />
        <button className="dd-toggle-button" {...getToggleButtonProps()}>
          {isOpen ? <>&#8593;</> : <>&#8595;</>}
        </button>
        <ul className="dd-menu" {...getMenuProps()}>
          {isOpen &&
            items.map((item, index) => (
              <li
                {...getItemProps({ item, index })}
                key={item}
                style={{
                  background: index === highlightedIndex && 'lightgray',
                }}
                className="dd-list-element"
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default Combobox;
