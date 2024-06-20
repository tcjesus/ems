import { useEffect, useState } from 'react';
import { Input } from 'reactstrap';
import CidadeService from 'services/CidadeService';

const getLabel = (record) => `${record.nome}`;
const service = CidadeService;

const BuiltSelect = ({ id = 'input-cidade', name = 'cidade', value: record = '', estado = null, onChange = null, placeholder = `Selecione uma Cidade` }) => {
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
    async function fetchData(estado) {
      if (!estado) return;

      try {
        const filters = { sigla: estado.sigla }
        const response = await service.list(filters);
        setOptions(response);
        setValue(record?.id);
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar opções');
      }
    }
    if (isLoading && estado) {
      fetchData(estado);
      setIsLoading(false);
    }
  }, [isLoading, estado, record]);

  useEffect(() => {
    setIsLoading(true);
  }, [estado]);

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
            .map((record, index) => (
              <option key={`${id}-${index}`} value={record.id}>{getLabel(record)}</option>
            ))
        }
      </Input>
    </>
  );
}

export default BuiltSelect;