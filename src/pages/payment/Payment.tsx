import * as React from 'react';
import { Button, Card, Col, Row, Typography } from 'antd';

const bitcoinIcon = require('@/assets/bitcoin.png');

const { NODE_ENV } = process.env;

const Payment: React.FC = () => {
  const description =
    'Logo; Unlock eaccess to 15 coil types calculator ; Sweet Spot Finder ; Advanced Coil specs ; Batteries charts; Min. battery resistance; Wires length; Visualize coils; Ad-free; Support project development';

  return (
    <Row>
      <Col span={12}>
        <Card>{description}</Card>
      </Col>

      <Col span={12}>
        <Card>
          <Typography.Title>Vape Tool Pro</Typography.Title>
          <Typography.Title>$4.99</Typography.Title>
          <Typography.Paragraph>Lifetime</Typography.Paragraph>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href={`https://www.${
              NODE_ENV === 'development' ? 'sandbox.' : ''
            }paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${
              NODE_ENV === 'production' ? 'UBCLCJ384D2D4' : '3FAV75HYMXJ5N'
            }`}
          >
            <img
              src="https://www.paypalobjects.com/digitalassets/c/website/marketing/apac/C2/logos-buttons/44_Blue_CheckOut_Pill_Button.png"
              alt="Check out with PayPal"
            />
          </a>

          <Button
            type="primary"
            shape="round"
            size="large"
            target="_blank"
            href="https://commerce.coinbase.com/checkout/5e8d6403-71dc-4988-8b06-f21d8d296cb3"
          >
            <img
              style={{ maxWidth: 30, paddingRight: 8 }}
              src={bitcoinIcon}
              alt="cryptocurrency payment"
            />
            Pay with cryptocurrency
          </Button>

          <Typography.Title>$0.99</Typography.Title>
          <Typography.Paragraph>Subscription</Typography.Paragraph>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href={`https://www.${
              NODE_ENV === 'development' ? 'sandbox.' : ''
            }paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${
              NODE_ENV === 'production' ? 'PAJTMA62ZSBRW' : 'WABX9M3L32NJS'
            }`}
          >
            <img
              src="https://www.paypalobjects.com/digitalassets/c/website/marketing/apac/C2/logos-buttons/44_Blue_CheckOut_Pill_Button.png"
              alt="Check out with PayPal"
            />
          </a>

          <Button
            type="primary"
            shape="round"
            size="large"
            target="_blank"
            href="https://commerce.coinbase.com/checkout/5e8d6403-71dc-4988-8b06-f21d8d296cb3"
          >
            <img
              style={{ maxWidth: 30, paddingRight: 8 }}
              src={bitcoinIcon}
              alt="cryptocurrency payment"
            />
            Pay with cryptocurrency
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default Payment;
