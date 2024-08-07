import { useEffect, useState } from "react";
import { Input } from "reactstrap";

const DefaultSelect = (recordName, inputName, service, getLabel, placeholder = `Select a ${recordName}`) => {
  const BuiltSelect = ({ id = 'input-' + inputName, name = inputName, value: record = '', filter = (record) => true, onChange = null }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(record?.id);

    const _onChange = (e) => {
      e.preventDefault();
      setValue(e.target.value);
      const record = options.find(r => `${r.id}` === e.target.value);
      if (onChange) onChange({ target: { name: e.target.name, value: record } });
    }

    useEffect(() => {
      async function fetchData() {
        try {
          const response = await service.list();
          setOptions(response);
          setValue(record?.id);
        } catch (error) {
          console.error(error);
          alert('Erro ao carregar opções');
        }
      }
      if (isLoading) {
        fetchData();
        setIsLoading(false);
      }
    }, [isLoading, record]);

    useEffect(() => {
      setIsLoading(true);
    }, [filter]);

    useEffect(() => {
      if (!isLoading) {
        setValue(record?.id);
      }
    }, [isLoading, record]);

    return (
      <>
        <Input
          id={id}
          className="form-control-alternative"
          type="select"
          name={name}
          value={value}
          onChange={_onChange}
        >
          <option value="">{placeholder}</option>
          {
            options
              .filter(filter)
              .map((record, index) => (
                <option key={`${id}-${index}`} value={record.id}>{getLabel(record)}</option>
              ))
          }
        </Input>
      </>
    );
  }

  return BuiltSelect;
};

export default DefaultSelect;