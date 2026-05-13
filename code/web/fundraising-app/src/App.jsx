import './App.css';
import { Link as RouterLink, Routes, Route } from 'react-router-dom';
import { Link, Stack, Box } from '@mui/material';

import LogoBTC from './assets/logo-btc.svg';
import LogoPepe from './assets/logo-pepe.svg';
import PageViewFundraiser from './fundraising';
import PageReceipt from './fundraising/Receipt';
import PageCreateFundraiser from './fundraising/CreateFundraiser';

function App() {
  return (
    <section id="center">
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <img src={LogoBTC} width={150} alt="Bitcoin logo" />
        <img src={LogoPepe} width={150} alt="Pepe logo" />
      </Box>

      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', justifyContent: 'center', my: 2 }}
      >
        <Link component={RouterLink} to="/" underline="hover">
          View
        </Link>
        <Link
          component={RouterLink}
          to="/fundraising/create-fundraiser"
          underline="hover"
        >
          Create
        </Link>
      </Stack>

      <Routes>
        <Route path="/" element={<PageViewFundraiser />} />
        <Route path="/fundraising/create-fundraiser" element={<PageCreateFundraiser />} />
        <Route path="/fundraising/receipt" element={<PageReceipt />} />
      </Routes>
    </section>
  );
}

export default App;
