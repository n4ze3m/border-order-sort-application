import { Button, Badge, Container, Group, Loader, Skeleton, Text, Timeline, UnstyledButton } from "@mantine/core";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";



export const HomeBody = () => {

    const router = useRouter()

    const {
        data: orders,
        status: ordersStatus,
    } = trpc.order.getDelivery.useQuery()


    console.log(orders)

    const {
        mutate: updateOrder,
        isLoading: updateOrderLoading,
    } = trpc.order.generateDelivery.useMutation()

    return (
        <Container my="md">
            <Group position="right">
                <Button
                    loading={updateOrderLoading}
                    onClick={() => updateOrder()}
                    color='teal'>Get new orders</Button>
            </Group>
            {
                ordersStatus === "loading" && <Loader />
            }
            {
                ordersStatus === "error" && <Text>Something went wrong</Text>
            }

            {
                ordersStatus === "success" && (
                    <Timeline active={1}>
                        <Timeline.Item title="Package sorting hub">
                            <Text>
                                Chennai, Tamil Nadu, India
                            </Text>
                        </Timeline.Item>
                        {
                            orders.data.map((order, index) => (
                                <Timeline.Item
                                    key={index}
                                    title={
                                        <Group>
                                            <Text weight="bold">      {order.order.recipient}</Text>
                                        </Group>
                                    }
                                >
                                    <Text>
                                        {order.order.address}
                                    </Text>
                                    <Group my="md">
                                        {
                                            order.order.cod ?
                                                <Badge color="red">COD</Badge> :
                                                <Badge color="green">Prepaid</Badge>
                                        }
                                        
                                        <Text>
                                            {`₹ ${order.order.price}`}
                                        </Text>
                                        {
                                            order.distance
                                        }
                                        <UnstyledButton
                                        onClick={() => {
                                            // open google maps with lat and long
                                            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${order.latitude},${order.longitude}`
                                            // open in new tab
                                            window.open(mapUrl, '_blank')
                                        }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{
                                                height: '1.5rem',
                                                width: '1.5rem',
                                            }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                            </svg>

                                        </UnstyledButton>
                                    </Group>
                                </Timeline.Item>
                            ))
                        }
                    </Timeline>
                )
            }
        </Container>
    );
};
