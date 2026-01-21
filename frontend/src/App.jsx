import api from './api/axios';

function App() {
  const testApi = async () => {
    try {
      const res = await api.get('/');
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>AgendaNow</h1>
      <button onClick={testApi}>Test API</button>
    </div>
  );
}

export default App;
