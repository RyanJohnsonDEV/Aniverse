import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import AnimeSearch from './pages/AnimeSearch';
import AnimeDetails from './pages/AnimeDetails';

function App() {
  const router = createBrowserRouter([
    {
      index: true,
      element: <AnimeSearch />,
    },
    {
      path: '/:id',
      element: <AnimeDetails />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
