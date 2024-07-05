// Reordering of state. DynamoDB orders alphabetically.
export default function reorderState(state: State) {
  return {
    customer_name: state.customer_name || '',
    property_type: state.property_type || '',
    bedrooms: state.bedrooms || '0',
    locations: state.locations || [],
    additional_details: state.additional_details || [],
    budget: state.budget || 0,
    down_payment: state.down_payment || 0,
    lender: state.lender || '',
    move_in_timeframe: state.move_in_timeframe || '',
    contact_information: {
      email: state.contact_information?.email || '',
      phone: state.contact_information?.phone || '',
    },
  };
}
