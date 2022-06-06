import { motion } from 'framer-motion';

import CustomerInformationCard from '../components/CustomerInformationCard';
import CustomerAddressCard from '../components/CustomerAddressCard';
// import CustomerPointCard from '../components/CustomerPointCard';

function CustomerContent() {
  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <div className="md:flex">
        <div className="flex flex-col w-full space-y-20">
          {/* <CustomerPointCard /> */}
          <CustomerInformationCard />
          <CustomerAddressCard />
        </div>
      </div>
    </motion.div>
  );
}

export default CustomerContent;
