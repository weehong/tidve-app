import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import { SubscriptionReminderTemplateProps } from "@/type/email/SubscriptionReminderTemplateProp";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 25px 48px",
  backgroundImage: 'url("/static/raycast-bg.png")',
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat, no-repeat",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
};

const body = {
  margin: "24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginLeft: "4px",
};

export default function SubscriptionReminderTemplate({
  data,
}: {
  data: SubscriptionReminderTemplateProps;
}) {
  return (
    <Html>
      <Head />
      <Preview>Log in with this magic link.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/static/raycast-logo.png`}
            width={48}
            height={48}
            alt="Raycast"
          />
          <Heading style={heading}>🪄 Your magic link</Heading>
          <Section style={body}>
            <Text style={paragraph}>
              You have a subscription that is about to renew.
            </Text>
            {data &&
              data.subscriptions.map((subscription) => (
                <Text style={paragraph}>{subscription.name}</Text>
              ))}
          </Section>
          <Text style={paragraph}>
            Best,
            <br />- Raycast Team
          </Text>
          <Hr style={hr} />
          <Img
            src={`${baseUrl}/static/raycast-logo.png`}
            width={32}
            height={32}
            style={{
              WebkitFilter: "grayscale(100%)",
              filter: "grayscale(100%)",
              margin: "20px 0",
            }}
          />
          <Text style={footer}>Raycast Technologies Inc.</Text>
          <Text style={footer}>
            2093 Philadelphia Pike #3222, Claymont, DE 19703
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
