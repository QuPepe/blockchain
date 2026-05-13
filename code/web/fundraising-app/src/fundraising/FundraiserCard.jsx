import { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import cc from 'cryptocompare';

import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { ETHEREUM_URL } from './index.jsx';
import fundraiserContractABI from './abi/Fundraiser-abi.json';

const FundraiserCard = ({ fundraiser }) => {
  // provider / signer / contract
  const [accounts, setAccounts] = useState([]);
  const [signer, setSigner] = useState(null);

  // contract data
  const [contractData, setContractData] = useState({
    fundName: '',
    fundUrl: '',
    fundImageUrl: '',
    fundDescription: '',
    fundBeneficiary: '',
    fundTotalDonationsWei: '0',
  });

  const [totalDonations, setTotalDonations] = useState(0); // USD
  const [userDonations, setUserDonations] = useState({ values: [], dates: [] });
  const [donationAmount, setDonationAmount] = useState(''); // USD input
  const [exchangeRate, setExchangeRate] = useState(0); // USD per ETH
  const [isOwner, setIsOwner] = useState(false);
  const [open, setOpen] = useState(false);
  const [newFundBeneficiary, setNewFundBeneficiary] = useState('');

  // read-only provider for public reads
  const rpcProvider = useMemo(
    () => new ethers.JsonRpcProvider(ETHEREUM_URL),
    []
  );

  // helpers to build contracts
  const getReadContract = (providerLike) =>
    new ethers.Contract(fundraiser, fundraiserContractABI, providerLike);

  const getWriteContract = (signerLike) =>
    new ethers.Contract(fundraiser, fundraiserContractABI, signerLike);

  // derived: convert USD -> ETH 顯示用
  const ethAmount = useMemo(() => {
    const usd = parseFloat(donationAmount);
    if (!exchangeRate || !usd || Number.isNaN(usd)) return '0.0000';
    return (usd / exchangeRate).toFixed(4);
  }, [donationAmount, exchangeRate]);

  // ----- init & loaders -----
  const init = async () => {
    try {
      let providerForReads = rpcProvider;
      let userAccounts = [];
      let s = null;

      if (window.ethereum) {
        // silent check
        userAccounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (userAccounts.length > 0) {
          const browser = new ethers.BrowserProvider(window.ethereum);
          s = await browser.getSigner();
          setSigner(s);
          setAccounts([await s.getAddress()]);
          providerForReads = browser;
        } else {
          setAccounts([]);
          setSigner(null);
        }
      } else {
        setAccounts([]);
        setSigner(null);
      }

      // 有 signer 就用 signer 綁定合約（讀寫皆可），否則用只讀合約
      const c = s ? getWriteContract(s) : getReadContract(providerForReads);

      const [
        fundName,
        fundUrl,
        fundImageUrl,
        fundDescription,
        fundBeneficiary,
        fundTotalDonationsWei,
      ] = await Promise.all([
        c.name(),
        c.url(),
        c.imageUrl(),
        c.description(),
        c.beneficiary(),
        c.totalDonations(),
      ]);

      setContractData({
        fundName,
        fundUrl,
        fundImageUrl,
        fundDescription,
        fundBeneficiary,
        fundTotalDonationsWei: fundTotalDonationsWei.toString(),
      });

      // 匯率 & 總額 (USD)
      try {
        const prices = await cc.price('ETH', ['USD']);
        setExchangeRate(prices.USD);
        const eth = Number(ethers.formatEther(fundTotalDonationsWei));
        setTotalDonations((prices.USD * eth).toFixed(2));
      } catch (err) {
        console.error('Exchange rate fetch error:', err);
      }

      // user-specific data：只有連上錢包時才查
      if (userAccounts.length > 0) {
        // 用 signer 綁定的合約讀（msg.sender 正確）
        // 若上面 c 不是 signer（極少見），就手動指定 from：
        let values, dates;
        try {
          [values, dates] = await c.myDonations();
        } catch {
          [values, dates] = await c.myDonations({ from: userAccounts[0] });
        }

        setUserDonations({
          values: values.map((v) => v),             // BigInt[]
          dates: dates.map((d) => Number(d)),       // seconds -> number
        });

        const owner = await c.owner();
        setIsOwner(owner.toLowerCase() === userAccounts[0].toLowerCase());
      } else {
        setUserDonations({ values: [], dates: [] });
        setIsOwner(false);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to initialize ethers or contract');
    }
  };

  useEffect(() => {
    if (fundraiser) init();
  }, [fundraiser]);

  useEffect(() => {
    if (!window.ethereum) return undefined;

    const handleAccountsChanged = async () => {
      await init(); // 重新初始化，會自動更新 signer / owner / myDonations
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ----- actions -----
  const donateFunds = async () => {
    try {
      if (!signer) {
        alert('Please connect your wallet to donate.');
        return;
      }
      const usd = parseFloat(donationAmount);
      if (!exchangeRate || !usd || Number.isNaN(usd) || usd <= 0) {
        alert('Please enter a valid USD amount.');
        return;
      }
      const ethTotal = usd / exchangeRate;
      const value = ethers.parseEther(ethTotal.toFixed(18)); // 高精度再轉

      const c = getWriteContract(signer);

      // gas 預估（可選擇性失敗 fallback）
      let gasLimit;
      try {
        gasLimit = await c.estimateGas.donate({ value });
      } catch {
        gasLimit = 650000n;
      }

      const tx = await c.donate({ value, gasLimit });
      await tx.wait();

      alert('Donation successful');
      setOpen(false);
      setDonationAmount('');
      await init(); // refresh，會更新 myDonations
    } catch (err) {
      console.error('Donation failed:', err);
      const msg = err?.shortMessage || err?.info?.error?.message || err?.message || 'Donation failed';
      alert(msg);
    }
  };

  const withdrawFunds = async () => {
    try {
      if (!signer) {
        alert('Please connect your wallet as the owner.');
        return;
      }
      const c = getWriteContract(signer);
      const tx = await c.withdraw();
      await tx.wait();
      alert('Withdrawal successful');
      setOpen(false);
      await init();
    } catch (err) {
      console.error('Withdrawal failed:', err);
      const msg = err?.shortMessage || err?.info?.error?.message || err?.message || 'Withdrawal failed';
      alert(msg);
    }
  };

  const setBeneficiary = async () => {
    try {
      if (!signer) {
        alert('Please connect your wallet as the owner.');
        return;
      }
      if (!ethers.isAddress(newFundBeneficiary)) {
        alert('Invalid beneficiary address.');
        return;
      }
      const c = getWriteContract(signer);
      const tx = await c.setBeneficiary(newFundBeneficiary);
      await tx.wait();
      alert('Beneficiary updated');
      setOpen(false);
      setNewFundBeneficiary('');
      await init();
    } catch (err) {
      console.error('Set beneficiary failed:', err);
      const msg = err?.shortMessage || err?.info?.error?.message || err?.message || 'Set beneficiary failed';
      alert(msg);
    }
  };

  // ----- render helpers -----
  const renderDonationsList = () => {
    if (!accounts.length) {
      return <Typography variant="body2">Connect wallet to see your donations.</Typography>;
    }
    if (!userDonations?.values?.length || !userDonations?.dates?.length) {
      return <p>No donations yet</p>;
    }

    return userDonations.values.map((value, i) => {
      const eth = Number(ethers.formatEther(value));   // value: BigInt (wei)
      const usd = (exchangeRate * eth).toFixed(2);
      const tsSec = userDonations.dates[i];
      const dateStr = new Date(tsSec * 1000).toLocaleString();

      return (
        <div key={dateStr} style={{ marginBottom: 8 }}>
          <Typography variant="body2" color="text.secondary">
            {dateStr} — ${usd}
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 0.5 }}>
            <Link to="/fundraising/receipt"
              state={{ fund: contractData.fundName, date: tsSec, money: usd }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Request Receipt
            </Link>
          </Button>
        </div>
      );
    });
  };

  // ----- UI -----
  return (
    <>
      {/* Donation dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Donate to {contractData.fundName}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {contractData.fundImageUrl && (
              <img
                src={contractData.fundImageUrl}
                width={200}
                height={130}
                alt={contractData.fundName}
              />
            )}
            <Typography variant="body2">{contractData.fundDescription}</Typography>
            <FormControl>
              <Input
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="0.00 (USD)"
                inputMode="decimal"
              />
            </FormControl>
            <Typography variant="body2">ETH: {ethAmount}</Typography>
            <Button onClick={donateFunds} variant="contained">
              Donate
            </Button>
            <Typography variant="body2" sx={{ mt: 1 }}>My Donations</Typography>
            {renderDonationsList()}
            {isOwner && (
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                  <Input
                    value={newFundBeneficiary}
                    onChange={(e) => setNewFundBeneficiary(e.target.value)}
                    placeholder="New Beneficiary Address"
                  />
                </FormControl>
                <Button variant="contained" sx={{ mt: 2 }} onClick={setBeneficiary}>
                  Set Beneficiary
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {isOwner && (
            <Button variant="contained" onClick={withdrawFunds}>
              Withdraw
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Fundraiser summary card */}
      <Card sx={{ maxWidth: 400 }}>
        {contractData.fundImageUrl && (
          <CardMedia
            component="img"
            height={250}
            image={contractData.fundImageUrl}
            alt="Fundraiser Image"
            onClick={handleOpen}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5">
            {contractData.fundName}
          </Typography>
          <Stack spacing={2} alignItems="flex-start">
            <Typography variant="body2" color="text.secondary">
              Description: {contractData.fundDescription}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              URL: {contractData.fundUrl}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Donations: ${totalDonations}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="left">
              Beneficiary Wallet Address: {contractData.fundBeneficiary}
            </Typography>
          </Stack>
          <Button onClick={handleOpen} variant="contained" sx={{ mt: 1 }}>
            More
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default FundraiserCard;
