import React from "react";
import { Segment, Header, List, Message, Icon } from "semantic-ui-react";
function PrivacyPolicy() {
  return (
    <Segment padded="very" style={{ maxWidth: "800px", margin: "0 auto",color:'black' }}>
      {/* Main Header */}
      <Header as="h2" textAlign="center" style={{ marginBottom: "30px" }}>
        Privacy Policy
      </Header>

      {/* Introduction */}
      <Message info>
        <Message.Header>
          <Icon name="info circle" /> Introduction
        </Message.Header>
        <p>
          At <strong>Saliheen Perfumes</strong>, we are committed to protecting
          your privacy. This Privacy Policy outlines how we collect, use, and
          safeguard your personal information when you visit our website or make
          a purchase from us.
        </p>
      </Message>

      {/* Information We Collect */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Information We Collect
      </Header>
      <List relaxed>
        <List.Item>
          <List.Icon name="user" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>Personal Information</List.Header>
            <List.Description>
              We may collect personal details such as your name, email address,
              phone number, and shipping address.
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="payment" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>Payment Information</List.Header>
            <List.Description>
              When you make a purchase, we collect payment information such as
              credit/debit card details or other payment method details.
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="browser" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>Technical Information</List.Header>
            <List.Description>
              We may collect technical data such as your IP address, browser
              type, and operating system when you visit our website.
            </List.Description>
          </List.Content>
        </List.Item>
      </List>

      {/* How We Use Your Information */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        How We Use Your Information
      </Header>
      <List bulleted>
        <List.Item>To process and fulfill your orders.</List.Item>
        <List.Item>To communicate with you about your orders.</List.Item>
        <List.Item>To improve our website and services.</List.Item>
        <List.Item>To send promotional offers and updates (if you opt-in).</List.Item>
      </List>

      {/* Data Security */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Data Security
      </Header>
      <Message warning>
        <Message.Header>
          <Icon name="shield" /> Your Security Matters
        </Message.Header>
        <p>
          We use industry-standard security measures to protect your personal
          information from unauthorized access, alteration, or disclosure.
          However, no method of transmission over the internet is 100% secure.
        </p>
      </Message>

      {/* Third-Party Services */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Third-Party Services
      </Header>
      <p>
        We may use third-party services (e.g., payment processors, shipping
        providers) to facilitate our services. These third parties have access
        to your information only to perform specific tasks on our behalf and are
        obligated not to disclose or use it for other purposes.
      </p>

      {/* Your Rights */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Your Rights
      </Header>
      <List bulleted>
        <List.Item>
          You have the right to access, update, or delete your personal
          information.
        </List.Item>
        <List.Item>
          You can opt-out of receiving promotional emails at any time.
        </List.Item>
        <List.Item>
          You can request a copy of the personal data we hold about you.
        </List.Item>
      </List>

      {/* Changes to This Policy */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Changes to This Policy
      </Header>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page, and we will notify you of significant changes via
        email or a notice on our website.
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
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:privacy@saliheenperfumes.com">
            privacy@saliheenperfumes.com
          </a>
        </p>
      </Message>
    </Segment>
  );
}

export default PrivacyPolicy;