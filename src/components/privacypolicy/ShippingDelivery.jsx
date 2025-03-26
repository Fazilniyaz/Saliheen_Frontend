import React from "react";
import { Segment, Header, List, Message, Icon } from "semantic-ui-react";

function ShippingDelivery() {
  return (
    <Segment padded="very" style={{ maxWidth: "800px", margin: "0 auto" ,color:'black'}}>
      {/* Main Header */}
      <Header as="h2" textAlign="center" style={{ marginBottom: "30px" }}>
        Shipping & Delivery
      </Header>

      {/* Shipping Information Message */}
      <Message info>
        <Message.Header>
          <Icon name="shipping fast" /> Fast and Reliable Shipping
        </Message.Header>
        <p>
          We offer fast and reliable shipping services. Delivery times may vary
          depending on your location.
        </p>
      </Message>

      {/* Payment Options Section */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Payment Options
      </Header>
      <List relaxed>
        {/* Online Payment Option */}
        <List.Item>
          <List.Icon name="credit card" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>Online Payment</List.Header>
            <List.Description>
              Enjoy <strong>free shipping</strong> on all orders paid online.
            </List.Description>
          </List.Content>
        </List.Item>

        {/* Cash on Delivery Option */}
        <List.Item>
          <List.Icon name="money bill" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>Cash on Delivery (COD)</List.Header>
            <List.Description>
              An additional <strong>₹100</strong> will be charged as a shipping
              fee for COD orders.
            </List.Description>
          </List.Content>
        </List.Item>
      </List>

      {/* Important Notes Section */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Important Notes
      </Header>
      <List bulleted>
        <List.Item>
          For online payments, we accept major credit/debit cards, UPI, and net
          banking.
        </List.Item>
        <List.Item>
          For Cash on Delivery, please ensure you have the exact amount ready
          when the delivery arrives.
        </List.Item>
        <List.Item>
          Delivery times may vary depending on your location and availability of
          the product.
        </List.Item>
      </List>

      {/* Additional Message */}
      <Message warning style={{ marginTop: "30px" }}>
        <Message.Header>
          <Icon name="warning circle" /> Note
        </Message.Header>
        <p>
          For any issues related to shipping or delivery, please contact our
          support team at{" "}
          <a href="mailto:support@saliheenperfumes.com">
            support@saliheenperfumes.com
          </a>
          .
        </p>
      </Message>
    </Segment>
  );
}

export default ShippingDelivery;