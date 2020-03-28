import * as React from 'react';
import { Button, Card, Col, Radio, Row, Tag, Typography } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

import { CheckCircleFilled } from '@ant-design/icons';
import styles from './payment.less';

const stripeLogo = require('@/assets/stripe.png');
const paypalLogo = require('@/assets/paypal.png');
const coinbaseLogo = require('@/assets/coinbase.png');

const { NODE_ENV } = process.env;

const LIFETIME = 'LIFETIME';
const SUBSCRIPTION = 'SUBSCRIPTION';

// TODO: Move all the codes to some config (preferably provided from server or added in CI step)

const paypalCodes = {
  // first PRODUCTION, second DEVELOPMENT
  [LIFETIME]: ['UBCLCJ384D2D4', '3FAV75HYMXJ5N'],
  [SUBSCRIPTION]: ['PAJTMA62ZSBRW', 'WABX9M3L32NJS'],
};

const coinbaseCodes = [
  '5e8d6403-71dc-4988-8b06-f21d8d296cb3',
  '5e8d6403-71dc-4988-8b06-f21d8d296cb3',
];

const Payment: React.FC = () => {
  const [type, setType] = React.useState(LIFETIME);
  const [step, setStep] = React.useState(0);

  const onChange = (e: RadioChangeEvent) => setType(e?.target?.value || LIFETIME);

  const getPaypalHref = () => {
    const code = paypalCodes[type][NODE_ENV === 'production' ? 0 : 1];
    const sandBoxStr = NODE_ENV === 'development' ? 'sandbox.' : '';

    return `https://www.${sandBoxStr}paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${code}`;
  };

  const getCoinbaseHref = () => {
    const code = coinbaseCodes[NODE_ENV === 'production' ? 0 : 1];
    return `https://commerce.coinbase.com/checkout/${code}`;
  };

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col xs={24} md={12} style={{ maxWidth: 505 }}>
        <Card className={styles.benefitsCard} style={{ minHeight: 500 }}>
          <Typography.Title>Vape Tool Pro Benefits</Typography.Title>
          <ul>
            <li>
              Access to <b>15</b> coil types calculator
            </li>
            <li>Sweet Spot Finder</li>
            <li>Advanced Coil specs</li>
            <li>Batteries charts</li>
            <li>Min battery resistance</li>
            <li>Wires length</li>
            <li>Visualize coils</li>
            <li>Ad-free</li>
            <li>Support project development</li>
          </ul>
        </Card>
      </Col>

      <Col xs={24} md={12} style={{ maxWidth: 505 }}>
        <Card className={styles.paymentCard} style={{ minHeight: 500 }}>
          <Typography.Title>Vape Tool Pro</Typography.Title>
          <Typography.Title level={4}>Choose you plan:</Typography.Title>
          <Radio.Group onChange={onChange} value={type}>
            <Radio
              value={LIFETIME}
              className={`${styles.paymentOption} ${type === LIFETIME ? styles.active : ''}`}
            >
              <div className={styles.radioText}>
                <Tag color="green">Best option</Tag>
                <div>Lifetime @ $4.99</div>
              </div>
            </Radio>
            <Radio
              value={SUBSCRIPTION}
              className={`${styles.paymentOption} ${type === SUBSCRIPTION ? styles.active : ''}`}
            >
              <div className={styles.radioText}>
                <Tag color="blue">Cheapest</Tag>
                <div>Monthly @ $0.99</div>
              </div>
            </Radio>
          </Radio.Group>
          <Button type="primary" onClick={() => setStep(1)} disabled={step > 0} block>
            Continue
          </Button>

          {step > 0 && (
            <>
              <Typography.Title level={4} style={{ marginTop: 24 }}>
                Choose you payment method:
              </Typography.Title>
              <Row justify="center" gutter={[12, 12]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={8} style={{ minWidth: 150 }}>
                  <div className={`${styles.paymentMethod} ${styles.disabled}`}>
                    <span className={styles.methodName}>Credit Card</span>
                    <span className={styles.poweredBy}>powered by</span>
                    <img src={stripeLogo} alt="Stripe" />
                  </div>
                </Col>
                <Col xs={24} lg={8} style={{ minWidth: 150 }}>
                  <a target="_blank" rel="noreferrer noopener" href={getPaypalHref()}>
                    <div className={`${styles.paymentMethod} ${styles.paypalMethod}`}>
                      <img
                        src={paypalLogo}
                        className={styles.paypalLogo}
                        title="Pay with PayPal"
                        alt="PayPal"
                      />
                      <span className={styles.methodName}>checkout</span>
                    </div>
                  </a>
                </Col>
                <Col xs={24} lg={8} style={{ minWidth: 150 }}>
                  <a target="_blank" rel="noreferrer noopener" href={getCoinbaseHref()}>
                    <div className={styles.paymentMethod}>
                      <span className={styles.methodName}>Cryptocurrencies</span>
                      <span className={styles.poweredBy}>powered by</span>
                      <img src={coinbaseLogo} alt="Coinbase" />
                    </div>
                  </a>
                </Col>
              </Row>
            </>
          )}

          <Typography.Paragraph className={styles.accepted}>
            Credit cards (powered by Stripe), PayPal, and all major cryptocurrencies accepted.
          </Typography.Paragraph>
          <Typography.Paragraph className={styles.return} strong>
            <CheckCircleFilled />
            Your purchase is fully refundable within 14 days.
          </Typography.Paragraph>
        </Card>
      </Col>
    </Row>
  );
};

export default Payment;
