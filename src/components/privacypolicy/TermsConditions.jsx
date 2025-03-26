import React from "react";
import { Segment, Header, List, Message, Icon } from "semantic-ui-react";

function TermsConditions() {
  return (
    <Segment padded="very" style={{ maxWidth: "800px", margin: "0 auto",color:'black' }}>
      {/* Main Header */}
      <Header as="h2" textAlign="center" style={{ marginBottom: "30px" }}>
        Terms and Conditions
      </Header>

      {/* Introduction */}
      <Message info>
        <Message.Header>
          <Icon name="info circle" /> Introduction
        </Message.Header>
        <p>
          Welcome to <strong>Saliheen Perfumes</strong>. By accessing or using
          our website, you agree to comply with and be bound by the following
          Terms and Conditions. Please read them carefully before using our
          services.
        </p>
      </Message>

      {/* Acceptance of Terms */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Acceptance of Terms
      </Header>
      <p>
        By using our website, you confirm that you are at least 18 years old and
        agree to these Terms and Conditions. If you do not agree, please do not
        use our website.
      </p>

      {/* Orders and Payments */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Orders and Payments
      </Header>
      <List relaxed>
        <List.Item>
          <List.Icon name="check circle" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>Order Confirmation</List.Header>
            <List.Description>
              Once you place an order, you will receive an email confirming the
              details of your purchase.
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="payment" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>Payment Methods</List.Header>
            <List.Description>
              We accept major credit/debit cards, UPI, and net banking. Cash on
              Delivery (COD) is also available with an additional shipping fee.
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="ban" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>No Cancellations</List.Header>
            <List.Description>
              Once an order is placed, it <strong>cannot be cancelled</strong>.
              Please review your order carefully before completing the purchase.
            </List.Description>
          </List.Content>
        </List.Item>
      </List>

      {/* Shipping and Delivery */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Shipping and Delivery
      </Header>
      <List bulleted>
        <List.Item>
          We aim to process and ship orders within <strong>1-2 business days</strong>.
        </List.Item>
        <List.Item>
          Delivery times may vary depending on your location and the availability
          of the product.
        </List.Item>
        <List.Item>
          For Cash on Delivery (COD) orders, an additional <strong>₹100</strong>{" "}
          will be charged as a shipping fee.
        </List.Item>
      </List>

      {/* Returns and Refunds */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Returns and Refunds
      </Header>
      <Message warning>
        <Message.Header>
          <Icon name="warning circle" /> Refund Policy
        </Message.Header>
        <p>
          Refunds are only available for damaged or defective items. To be
          eligible for a refund, the item must be returned within{" "}
          <strong>7 days</strong> of the order date. Please refer to our{" "}
          <a href="/refund-cancellation">Refund & Cancellation Policy</a> for
          more details.
        </p>
      </Message>

      {/* Intellectual Property */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Intellectual Property
      </Header>
      <p>
        All content on this website, including text, images, logos, and designs,
        is the property of <strong>Saliheen Perfumes</strong> and is protected
        by intellectual property laws. Unauthorized use of any content is
        strictly prohibited.
      </p>

      {/* Limitation of Liability */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Limitation of Liability
      </Header>
      <p>
        <strong>Saliheen Perfumes</strong> shall not be liable for any indirect,
        incidental, or consequential damages arising from the use of our website
        or products.
      </p>

      {/* Governing Law */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Governing Law
      </Header>
      <p>
        These Terms and Conditions are governed by the laws of India. Any
        disputes arising from these terms shall be resolved in the courts of
        India.
      </p>

      {/* Changes to Terms */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Changes to Terms
      </Header>
      <p>
        We reserve the right to update or modify these Terms and Conditions at
        any time. Any changes will be posted on this page, and your continued
        use of the website constitutes acceptance of the updated terms.
      </p>

      {/* Contact Us */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Contact Us
      </Header>
      <Message>
        <Message.Header>
          <Icon name="envelope" /> Have Questions?
        </Message.Header>
        <p>
          If you have any questions about these Terms and Conditions, please
          contact us at:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:support@saliheenperfumes.com">
            support@saliheenperfumes.com
          </a>
        </p>
      </Message>
    </Segment>
  );
}

export default TermsConditions;