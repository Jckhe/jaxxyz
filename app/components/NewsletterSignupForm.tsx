import {MuiTelInput} from 'mui-tel-input';
import type {ReactElement} from 'react';
import {useState} from 'react';
import {TextField, IconButton} from '@radix-ui/themes';
import {ArrowRightIcon} from '@radix-ui/react-icons';

const EmailAddressForm = () => {
  return (
    <TextField.Root placeholder="ENTER YOUR EMAIL ADDRESS" className="newsletter-signup-input">
      <TextField.Slot side="right" >
        <IconButton size="3" variant="ghost">
          <ArrowRightIcon height="20" width="20" className="newsletter-signup-input-icon" />
        </IconButton>
      </TextField.Slot>
    </TextField.Root>
  );
};

const PhoneNumberForm = () => {
  return (
      <TextField.Root placeholder="PHONE NUMBER" className="newsletter-signup-input">
        <TextField.Slot side="right" >
          <IconButton size="3" variant="ghost">
            <ArrowRightIcon height="20" width="20" className="newsletter-signup-input-icon" />
          </IconButton>
        </TextField.Slot>
      </TextField.Root>
  );
};

export default function NewsletterSignupForm(): ReactElement {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  const handlePhoneInput = (newValue: any) => {
    setPhoneNumber(newValue);
  };

  const handleEmailChange = (newValue: any) => {
    setEmailAddress(newValue);
  };

  return (
    <div className="newsletter-signup-form-container">
      <EmailAddressForm />
      <PhoneNumberForm />
    </div>
  );
}
