import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function CustomersHeader(props) {
  const customer = useSelector(({ customersApp }) => customersApp.customers.customer);

  return (
    <div className="flex flex-1 items-center justify-between p-4 sm:p-24">
      <div className="flex flex-shrink items-center sm:w-224">
        <div className="flex items-center w-full">
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            component={Link}
            variant="outlined"
            to="/customers"
            size="large"
          >
            <Icon
              component={motion.span}
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { delay: 0.2 } }}
              className="text-24 md:text-32"
            >
              arrow_back
            </Icon>
          </IconButton>

          <Typography
            component={motion.span}
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
            className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold w-full"
          >
            {customer && (
              <div className="flex flex-row w-full">
                <p className="pr-6">{customer.firstname && `${customer.firstname}`}</p>
                <p>{customer.lastname && `${customer.lastname} `}</p>
              </div>
            )}
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default CustomersHeader;
