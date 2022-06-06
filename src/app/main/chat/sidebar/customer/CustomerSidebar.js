import FuseScrollbars from '@fuse/core/FuseScrollbars';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useEffect, useState } from 'react';
import { closeCustomerSidebar } from '../../store/sidebarsSlice';
// import SocialIcon from '../../SocialIcon';
import { getCustomer } from '../../store/customerSlice';
// import { getCustomer, markMentionRead, updateCustomer } from './store/foxSlice';
// import CustomerLabel from './CustomerLabel';
import TeamChat from './TeamChat';
import Information from './Information';
import Label from './Label';
import Address from './Address';
// import CustomerAddress from './CustomerAddress';

function CustomerSidebar(props) {
  const dispatch = useDispatch();
  const selected = useSelector(({ chatApp }) => chatApp.current.selected);
  const selectType = useSelector(({ chatApp }) => chatApp.current.selectType);
  const customer = useSelector(({ chatApp }) => chatApp.customer.customer);
  const customerSidebarOpen = useSelector(({ chatApp }) => chatApp.sidebars.customerSidebarOpen);
  const [expanded, setExpanded] = useState(false);

  const [channelName, setChannelName] = useState('');
  const [customerName, setCustomerName] = useState('');
  useEffect(() => {
    if (selected && selected.channel) {
      if (selected.channel.channel === 'line' && selected.channel.line) setChannelName(selected.channel.line.name);
      if (selected.channel.channel === 'facebook' && selected.channel.facebook)
        setChannelName(selected.channel.facebook.name);
    }
    if (selected && selected.customer) {
      if (customerSidebarOpen) {
        dispatch(getCustomer({ customerId: selected.customer.id }));
      } else {
        setExpanded(false);
      }
    }
  }, [dispatch, customerSidebarOpen, selected]);

  useEffect(() => {
    if (customer) {
      if (customer.firstname || customer.lastname) {
        setCustomerName(`${customer.firstname} ${customer.lastname}`);
      } else if (customer.display) {
        setCustomerName(customer.display);
      }
    }
  }, [customer]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  if (!customer) {
    return null;
  }

  return (
    <div className="flex flex-col flex-auto h-full w-full">
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar className="flex justify-between items-center px-4">
          <Typography className="px-12" color="inherit" variant="subtitle1">
            Customer Info
          </Typography>
          <IconButton onClick={() => dispatch(closeCustomerSidebar())} color="inherit" size="large">
            <Icon>close</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>

      <FuseScrollbars className="overflow-y-auto flex-1">
        <Accordion color="primary" expanded={expanded === 'information'} onChange={handleChange('information')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <div className="flex flex-row space-x-12 items-center">
              <div className="relative">
                <Avatar src={customer.pictureURL} alt={customerName} className="w-64 h-64" />
              </div>
              <div className="flex flex-col space-y-6">
                <Typography variant="h6">{customerName}</Typography>
                <Typography variant="subtitle2">
                  {selected && selected.channel && selected.channel.channel && selected.channel.channel.toUpperCase()} :{' '}
                  {channelName}
                </Typography>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Information />
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'address'} onChange={handleChange('address')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
            <Typography>Address</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Address />
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'label'} onChange={handleChange('label')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
            <Typography>Label</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Label />
          </AccordionDetails>
        </Accordion>
        {selectType === 'chat' && (
          <Accordion expanded={expanded === 'teamChat'} onChange={handleChange('teamChat')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
              <Typography>Team Chat</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TeamChat expanded={expanded === 'teamChat'} />
            </AccordionDetails>
          </Accordion>
        )}
      </FuseScrollbars>
    </div>
  );
}

export default CustomerSidebar;
