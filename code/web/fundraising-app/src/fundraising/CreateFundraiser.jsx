import { useState } from 'react';
import { ethers } from 'ethers';

import { Container, Stack, TextField, Button, Typography, Paper } from '@mui/material';

import { fundraiserFactoryContractABI } from './index.jsx';
import { fundraiserFactoryContractAddr } from './index.jsx';

const CreateFundraiser = () => {
  const [fundName, setFundName] = useState('');
  const [fundUrl, setFundUrl] = useState('');
  const [fundImageUrl, setFundImageUrl] = useState('');
  const [fundDescription, setFundDescription] = useState('');
  const [fundBeneficiary, setFundBeneficiary] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask not detected. Please install it to create a fundraiser.');
        return;
      }

      // 簡單欄位檢查
      if (!fundName || !fundUrl || !fundImageUrl || !fundDescription || !fundBeneficiary) {
        alert('Please fill in all required fields.');
        return;
      }
      if (!ethers.isAddress(fundBeneficiary)) {
        alert('Beneficiary must be a valid Ethereum address.');
        return;
      }

      setSubmitting(true);

      // 1) 連線到錢包並取得 signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();

      // 2) 建立合約實例（帶 signer 才能送交易）
      const factory = new ethers.Contract(
        fundraiserFactoryContractAddr.address,
        fundraiserFactoryContractABI,
        signer
      );

      // 3) 呼叫 createFundraiser 並等待鏈上確認
      // 注意：參數順序要和 Solidity 定義一致
      const tx = await factory.createFundraiser(
        fundName,
        fundUrl,
        fundImageUrl,
        fundDescription,
        fundBeneficiary
      );

      // 等待交易被礦工打包
      await tx.wait();

      alert('Fundraiser is successfully created');

      // 清空表單（可選）
      setFundName('');
      setFundUrl('');
      setFundImageUrl('');
      setFundDescription('');
      setFundBeneficiary('');
    } catch (err) {
      console.error('Fundraiser creation error:', err);
      // ethers v6 常見錯誤訊息欄位：shortMessage / info.error / message
      const msg =
        err?.shortMessage ||
        err?.info?.error?.message ||
        err?.message ||
        'Failed to create fundraiser';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container sx={{ mt: 2 }} maxWidth="xl">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create a Fundraising Campaign
        </Typography>

        <Stack spacing={3}>
          <TextField
            required
            label="Fund Name"
            fullWidth
            value={fundName}
            onChange={(e) => setFundName(e.target.value)}
          />
          <TextField
            required
            label="Website"
            fullWidth
            value={fundUrl}
            onChange={(e) => setFundUrl(e.target.value)}
          />
          <TextField
            required
            label="Image URL"
            fullWidth
            value={fundImageUrl}
            onChange={(e) => setFundImageUrl(e.target.value)}
          />
          <TextField
            required
            label="Description"
            multiline
            rows={4}
            fullWidth
            value={fundDescription}
            onChange={(e) => setFundDescription(e.target.value)}
          />
          <TextField
            required
            label="Beneficiary Wallet Address"
            fullWidth
            value={fundBeneficiary}
            onChange={(e) => setFundBeneficiary(e.target.value)}
            helperText="Must be a valid EOA or contract address that can receive ETH"
          />
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="large"
            fullWidth
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CreateFundraiser;
