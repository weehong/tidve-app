import { Subscription } from "@prisma/client";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

type SubscriptionRenewalProps = {
  username: string;
  subscriptions: Subscription[];
  expiresIn: number;
};

export default function SubscriptionRenewal({
  username,
  subscriptions,
  expiresIn,
}: SubscriptionRenewalProps) {
  return (
    <Html>
      <Head />
      <Preview>Subscription Renewal</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="font-canela mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Tidverse
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              You have <strong>{subscriptions.length}</strong> subscription(s)
              will be renewed in {expiresIn} days.
            </Text>

            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 text-left text-[14px] leading-[24px] text-black">
                    Renewal Date
                  </th>
                  <th className="px-2 py-1 text-left text-[14px] leading-[24px] text-black">
                    Subscription
                  </th>
                  <th className="px-2 py-1 text-left text-[14px] leading-[24px] text-black">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="px-2 py-1 text-left text-[14px] leading-[24px] text-black">
                      {new Date(subscription.endDate).toLocaleDateString(
                        "en-US",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </td>
                    <td className="px-2 py-1 text-left text-[14px] leading-[24px] text-black">
                      {subscription.name}
                    </td>
                    <td className="px-2 py-1 text-left text-[14px] leading-[24px] text-black">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: subscription.currency,
                        currencyDisplay: "code",
                      }).format(subscription.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This message was intended for{" "}
              <span className="text-black">{username}</span>. If you are not the
              intended recipient, please ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
