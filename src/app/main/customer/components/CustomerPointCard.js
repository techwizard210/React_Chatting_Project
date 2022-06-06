import FuseLoading from '@fuse/core/FuseLoading';
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

function CustomerPointCard() {
  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };
  const customer = useSelector(({ customersApp }) => customersApp.customers.customer);

  const token = useSelector(({ auth }) => auth.user.token);
  const org = useSelector(({ auth }) => auth.organization.current);
  const [pointLog, setPointLog] = useState();
  const [rewardLog, setRewardLog] = useState();
  const [totalPoint, setTotalPoint] = useState(0);
  const [usedPoint, setUsedPoint] = useState(0);

  useEffect(() => {
    if (customer) {
      let tempTotalPoint = 0;
      let tempUsedPoint = 0;
      if (customer.pointLog.length) {
        customer.pointLog.forEach((element) => {
          tempTotalPoint += element.point;
        });
      }
      if (customer.rewardLog.length) {
        customer.rewardLog.forEach((element) => {
          tempUsedPoint += element.point;
        });
      }
      setTotalPoint(tempTotalPoint - tempUsedPoint);
      setUsedPoint(tempUsedPoint);
    }
  }, [customer]);

  return (
    <Card component={motion.div} variants={item} className="w-full rounded-16 shadow">
      <AppBar position="static" elevation={0}>
        <Toolbar className="px-8">
          <Typography variant="subtitle1" color="inherit" className="flex-1 px-12 font-medium">
            <span className="hidden sm:flex">Customer Point</span>
            <span className="flex sm:hidden">Point</span>
          </Typography>
        </Toolbar>
      </AppBar>

      <CardContent>
        {customer ? (
          <div className="grid grid-cols-2 justify-items-center">
            <div className="p-12 flex flex-col space-y-12 items-center">
              <Typography variant="h5" color="inherit">
                Total Point
              </Typography>
              <Typography variant="h6" color="inherit">
                {totalPoint}
              </Typography>
            </div>
            <div className="p-12 flex flex-col  space-y-12 items-center">
              <Typography variant="h5" color="inherit">
                Used Point
              </Typography>
              <Typography variant="h6" color="inherit">
                {usedPoint}
              </Typography>
            </div>
          </div>
        ) : (
          <FuseLoading />
        )}
      </CardContent>
    </Card>
  );
}

export default CustomerPointCard;
