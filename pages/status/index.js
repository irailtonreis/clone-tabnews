import useSWR from "swr";
async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Página de status</h1>
      <UpdatedAt />
      <h2>Informações do banco de dados</h2>
      <DataBaseInfos />
    </>
  );
}

function DataBaseInfos() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  if (isLoading) {
    return <p>Carregando...</p>;
  }
  if (!isLoading && data) {
    return (
      <div>
        <ul>
          <li>
            Conexões máximas: {data.dependencies.database.max_connections}
          </li>
          <li>
            Conexões abertas: {data.dependencies.database.opened_connections}
          </li>
          <li>Versão: {data.dependencies.database.version}</li>
        </ul>
      </div>
    );
  }
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 200,
  });

  let UpdatedAtText = "Carregando...";
  if (!isLoading && data) {
    UpdatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {UpdatedAtText}</div>;
}
