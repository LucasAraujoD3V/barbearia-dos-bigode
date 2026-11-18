import useApi from './useApi';

export default function useServicos() {
  const { dados, carregando, erro, recarregar } = useApi('/servicos');
  return { servicos: dados, carregando, erro, recarregar };
}
