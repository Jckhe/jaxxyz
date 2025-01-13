import {MuiTelInput} from 'mui-tel-input';
import type {ReactElement} from 'react';
import {useMemo, useEffect, useState} from 'react';
import {TextField, IconButton, DropdownMenu, Button} from '@radix-ui/themes';
import {ArrowRightIcon} from '@radix-ui/react-icons';
import countryCodes from '../../app/lib/countryPhoneCodes.json';

const EmailAddressForm = ({onChange, value}) => {
  return (
    <TextField.Root
      onChange={onChange}
      placeholder="ENTER YOUR EMAIL ADDRESS"
      className="newsletter-signup-input"
      value={value}
    >
      <TextField.Slot side="right">
        <IconButton size="3" variant="ghost">
          <ArrowRightIcon
            height="20"
            width="20"
            className="newsletter-signup-input-icon"
          />
        </IconButton>
      </TextField.Slot>
    </TextField.Root>
  );
};

type Country = {
  country: string;
  code: string;
};

const CountryCodeFlagMenu = () => {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button>
          {selectedCountry.country}
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="2">
        {countryCodes.map((country) => {
          return (
            <DropdownMenu.Item key={country.code}>
              {country.code}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

const PhoneNumberForm = ({onChange, value}) => {
  return (
    <TextField.Root
      placeholder="PHONE NUMBER"
      className="newsletter-signup-input"
    >
      <TextField.Slot side="left">
        <CountryCodeFlagMenu />
      </TextField.Slot>
      <TextField.Slot side="right">
        <IconButton size="3" variant="ghost">
          <ArrowRightIcon
            height="20"
            width="20"
            className="newsletter-signup-input-icon"
          />
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
    setEmailAddress(event.target.value);
  };

  return (
    <div className="newsletter-signup-form-container">
      <EmailAddressForm onChange={handleEmailChange} value={emailAddress} />
      <PhoneNumberForm />
    </div>
  );
}
