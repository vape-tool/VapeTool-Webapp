import * as React from 'react';

const Payment: React.FC = props => (
  <div>
    <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=UBCLCJ384D2D4">
      <img
        src="https://www.paypalobjects.com/digitalassets/c/website/marketing/apac/C2/logos-buttons/44_Blue_CheckOut_Pill_Button.png"
        alt="Check out with PayPal"
      />
    </a>
  </div>
);

export default Payment;
