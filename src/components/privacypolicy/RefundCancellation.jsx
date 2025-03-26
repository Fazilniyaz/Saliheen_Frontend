import React from "react";
import { Segment, Header, List, Message, Icon } from "semantic-ui-react";

function RefundCancellation() {
  return (
    <Segment padded="very" style={{ maxWidth: "800px", margin: "0 auto",color:'black' }}>
      {/* Main Header */}
      <Header as="h2" textAlign="center" style={{ marginBottom: "30px" }}>
        Refund & Cancellation Policy
      </Header>

      {/* Introduction */}
      <Message info>
        <Message.Header>
          <Icon name="info circle" /> Introduction
        </Message.Header>
        <p>
          At <strong>Saliheen Perfumes</strong>, we strive to ensure your complete
          satisfaction with every purchase. Please read our Refund & Cancellation
          Policy carefully to understand your rights and responsibilities.
        </p>
      </Message>

      {/* No Cancellations */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        No Cancellations After Ordering
      </Header>
      <Message warning>
        <Message.Header>
          <Icon name="warning circle" /> Important Note
        </Message.Header>
        <p>
          Once an order is placed, it <strong>cannot be cancelled</strong>. Please
          review your order carefully before completing the purchase.
        </p>
      </Message>

      {/* Refund Policy */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Refund Policy
      </Header>
      <List relaxed>
        <List.Item>
          <List.Icon name="check circle" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>Damaged or Defective Items</List.Header>
            <List.Description>
              If you receive a damaged or defective item, you are eligible for a
              full refund, provided the item is returned within{" "}
              <strong>7 days</strong> of the order date.
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="times circle" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>Non-Damaged Items</List.Header>
            <List.Description>
              Refunds are <strong>not available</strong> for non-damaged items
              or items returned after 7 days.
            </List.Description>
          </List.Content>
        </List.Item>
      </List>

      {/* Refund Process */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Refund Process
      </Header>
      <List ordered>
        <List.Item>
          Contact our support team at{" "}
          <a href="mailto:support@saliheenperfumes.com">
            support@saliheenperfumes.com
          </a>{" "}
          within 7 days of receiving the damaged item.
        </List.Item>
        <List.Item>
          Provide your order number, photos of the damaged item, and a brief
          description of the issue.
        </List.Item>
        <List.Item>
          Once your request is approved, you will receive instructions on how to
          return the item.
        </List.Item>
        <List.Item>
          After we receive and inspect the returned item, your refund will be
          processed within <strong>5-7 business days</strong>.
        </List.Item>
      </List>

      {/* Contact Us */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Contact Us
      </Header>
      <Message>
        <Message.Header>
          <Icon name="envelope" /> Have Questions?
        </Message.Header>
        <p>
          If you have any questions about our Refund & Cancellation Policy, please
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

export default RefundCancellation;