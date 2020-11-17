import React, { useEffect, useState } from 'react';
import { Button, Card, Col, message, Radio, Row, Spin, Tag, Typography } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { CheckCircleFilled } from '@ant-design/icons';
import { stripePromise } from '@/utils/stripe';
import {
  createStripeManageLink,
  createStripePayment,
  createSubscriptionForUser,
} from '@/utils/firebase';
import { verifyCurrentUserWithRedirect } from '@/services';
import { useModel } from 'umi';
import { IS_PRODUCTION } from '@/utils/utils';
import { PayPalButton } from 'react-paypal-button-v2';
import styles from './payment.less';

const stripeLogo = require('@/assets/stripe.png');
const coinbaseLogo = require('@/assets/coinbase.png');

export enum SubscriptionPlan {
  MONTHLY = 'MONTHLY',
  ANNUALLY = 'ANNUALLY',
  LIFETIME = 'LIFETIME',
}

// TODO: Move all the codes to some config (preferably provided from server or added in CI step)

const coinbaseCodes = {
  [SubscriptionPlan.MONTHLY]: '896d1477-7851-42e6-8ce3-0e141e6057ef',
  [SubscriptionPlan.ANNUALLY]: '5dbc5bd2-421c-4050-aab2-7231d2450675',
  [SubscriptionPlan.LIFETIME]: '5e8d6403-71dc-4988-8b06-f21d8d296cb3',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stripeCodes = {
  // first PRODUCTION, second DEVELOPMENT
  [SubscriptionPlan.MONTHLY]: ['plan_Ha1E7UzNidhC9Q', 'plan_GzHJlYB6AmQMJu'],
  [SubscriptionPlan.ANNUALLY]: ['plan_Ha1E0tVa0Be7Zx', 'plan_GzHrBem88w5v0n'],
  [SubscriptionPlan.LIFETIME]: ['sku_Ha1EpVv51gdqrb', 'price_1Hmm69BXl6CSFDJe9ghbla4c'],
};

const Payment: React.FC = () => {
  const { initialState, refresh } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [type, setType] = useState(SubscriptionPlan.ANNUALLY);
  const [step, setStep] = useState(0);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    verifyCurrentUserWithRedirect();
  });

  const onChange = (e: RadioChangeEvent) => setType(e?.target?.value || SubscriptionPlan.ANNUALLY);

  const getCoinbaseHref = () => {
    const code = coinbaseCodes[type];
    return `https://commerce.coinbase.com/checkout/${code}`;
  };

  const handleStripeClick = async () => {
    const stripe = await stripePromise;
    if (!currentUser?.email) {
      console.error('userEmail is undefined');
      message.error('You need to be logged in');
    } else if (stripe) {
      setProcessingPayment(true);

      try {
        if (type === SubscriptionPlan.LIFETIME) {
          const id = await createStripePayment(
            stripeCodes[type][IS_PRODUCTION ? 0 : 1],
            `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            `${window.location.origin}/payment/cancel`,
          );
          await stripe.redirectToCheckout({
            sessionId: id,
          });
        } else {
          const link = await createStripeManageLink(`${window.location.origin}/user/profile`);
          window.location.href = link;
        }
      } catch (err) {
        console.error(err);
        message.error(err.error.message);
      }

      setProcessingPayment(false);
    }
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
              value={SubscriptionPlan.MONTHLY}
              className={`${styles.paymentOption} ${
                type === SubscriptionPlan.MONTHLY ? styles.active : ''
              }`}
            >
              <div className={styles.radioText}>
                <Tag color="blue">Just trying out</Tag>
                <div>Monthly @ $0.99</div>
              </div>
            </Radio>
            <Radio
              value={SubscriptionPlan.ANNUALLY}
              className={`${styles.paymentOption} ${
                type === SubscriptionPlan.ANNUALLY ? styles.active : ''
              }`}
            >
              <div className={styles.radioText}>
                <Tag color="green">I&apos;m in</Tag>
                <div>Annually @ $3.99</div>
              </div>
            </Radio>
            <Radio
              value={SubscriptionPlan.LIFETIME}
              className={`${styles.paymentOption} ${
                type === SubscriptionPlan.LIFETIME ? styles.active : ''
              }`}
            >
              <div className={styles.radioText}>
                <Tag color="red">
                  I{' '}
                  <span role="img" aria-label="love">
                    love{' '}
                  </span>{' '}
                  it ❤️
                </Tag>
                <div>Lifetime @ $6.99</div>
              </div>
            </Radio>
          </Radio.Group>
          <Button type="primary" onClick={() => setStep(1)} disabled={step > 0} block>
            Continue
          </Button>

          {processingPayment && (
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" style={{ marginLeft: 8, marginRight: 8 }} />
            </div>
          )}
          {!processingPayment && step > 0 && (
            <>
              <Typography.Title level={4} style={{ marginTop: 24 }}>
                Choose you payment method:
              </Typography.Title>
              <Row justify="center" gutter={[12, 12]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={8} style={{ minWidth: 150 }}>
                  <div className={styles.paymentMethod} onClick={handleStripeClick}>
                    <span className={styles.methodName}>Credit Card</span>
                    <span className={styles.poweredBy}>powered by</span>
                    <img src={stripeLogo} alt="Stripe" />
                  </div>
                </Col>
                <Col xs={24} lg={8} style={{ minWidth: 150 }}>
                  <div className={`${styles.paymentMethod} ${styles.paypalMethod}`}>
                    <PayPalButton
                      options={{
                        vault: true,
                        clientId:
                          'AUEDO1Gov00KdUqSIP9KEkoFhizpHA4oZWKXbGewXBUQ0YY4ZbgKIqstqWgVdQLNNYNG2bX7g824WSXb',
                      }}
                      createSubscription={() => {
                        console.log('createSubscription');
                        // @ts-ignore
                        return createSubscriptionForUser(type.toLowerCase());
                      }}
                      onApprove={() => {
                        refresh();
                      }}
                    />
                  </div>
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
            <CheckCircleFilled style={{ marginRight: 4 }} />
            Your purchase is fully refundable within 14 days.
          </Typography.Paragraph>
        </Card>
      </Col>
    </Row>
  );
};

export default Payment;
