interface Message {
  text: string;
  isBot: boolean;
}

interface FormattedMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface State {
  customer_name: string;
  property_type: string;
  bedrooms: string;
  locations: string[];
  additional_details: string[];
  budget: number;
  down_payment: number;
  lender: string;
  move_in_timeframe: string;
  contact_information: {
    email: string;
    phone: string;
  };
}
