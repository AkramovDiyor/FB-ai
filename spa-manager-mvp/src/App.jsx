import { AppProviders } from './app/Providers';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <AppProviders>
      <Layout>
        <div style={{ padding: '20px' }}>
          <h1>SPA Manager MVP</h1>
          <p>Приложение для управления спа-объектом</p>
          <p>Выберите объект в шапке для начала работы</p>
        </div>
      </Layout>
    </AppProviders>
  );
}

export default App;
