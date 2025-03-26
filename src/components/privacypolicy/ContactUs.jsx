import React from "react";
import { Segment, Header, Form, Button, Icon, List, Message } from "semantic-ui-react";

function ContactUs() {
  return (
    <Segment padded="very" style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Main Header */}
      <Header as="h2" textAlign="center" style={{ marginBottom: "30px" }}>
        Contact Us
      </Header>

      {/* Introduction */}
      <Message info>
        <Message.Header>
          <Icon name="info circle" /> We're Here to Help!
        </Message.Header>
        <p>
          Have questions, feedback, or need assistance? Reach out to us using the
          form below or through our contact information. We'll get back to you as
          soon as possible.
        </p>
      </Message>

      {/* Contact Form */}
      <Header as="h2" style={{ marginTop: "30px" }}>
        Send Us a Message
      </Header>
      <Form>
        <Form.Input
          label="Name"
          placeholder="Enter your name"
          required
        />
        <Form.Input
          label="Email"
          placeholder="Enter your email"
          type="email"
          required
        />
        <Form.Input
          label="Subject"
          placeholder="Enter the subject"
          required
        />
        <Form.TextArea
          label="Message"
          placeholder="Enter your message"
          rows={6}
          required
        />
        <Button primary type="submit">
          <Icon name="send" /> Send Message
        </Button>
      </Form>

      {/* Contact Information */}
      <Header as="h2" style={{ marginTop: "50px" }}>
        Contact Information
      </Header>
      <List relaxed>
        <List.Item>
          <List.Icon name="map marker alternate" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>Address</List.Header>
            <List.Description>
            Saliheen Perfumes #2, <br/>Vincent Rd,<br/> near Masjidul Muslimeen , Fort, Coimbatore, Tamil Nadu 641001.
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="phone" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>Phone</List.Header>
            <List.Description>
              +91 8072826007
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="envelope" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>Email</List.Header>
            <List.Description>
              <a href="mailto:saliheenperfumes@gmail.com">
                saliheenperfumes@gmail.com
              </a>
            </List.Description>
          </List.Content>
        </List.Item>
      </List>

      {/* Map (Optional) */}
      <Header as="h2" style={{ marginTop: "50px" }}>
        Find Us on the Map
      </Header>
      <div style={{ height: "300px", backgroundColor: "#f0f0f0", borderRadius: "10px", overflow: "hidden" }}>
        {/* Embed a Google Map or any other map service here */}
        <iframe
          title="Saliheen Perfumes Location"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1157.6345153421153!2d76.96559120789108!3d10.991669091855398!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8590046440a5d%3A0x8fa6299e9c37a341!2sSaliheen%20Perfumes%20%232!5e0!3m2!1sen!2sin!4v1742639568974!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>




      </div>

      {/* Additional Message */}
      <Message warning style={{ marginTop: "30px" }}>
        <Message.Header>
          <Icon name="warning circle" /> Note
        </Message.Header>
        <p>
          Our customer support team is available from <strong>9 AM to 6 PM</strong>, Monday to Saturday. We are closed on public holidays.
        </p>
      </Message>
    </Segment>
  );
}

export default ContactUs;