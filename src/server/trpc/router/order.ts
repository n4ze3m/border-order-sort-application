import { TRPCError } from "@trpc/server";
import { randAddress, randPhoneNumber, randUser } from "@ngneat/falso";

import { publicProcedure, router, } from "../trpc";



const HUB_LATITUDE = 13.0827;
const HUB_LONGITUDE = 80.2707;
const HUB_POSTCODE = "600001";

const generateFakeLocation = () => {
    const lat = HUB_LATITUDE + Math.random() * 0.1 - 0.05;
    const long = HUB_LONGITUDE + Math.random() * 0.1 - 0.05;
    const postcode = HUB_POSTCODE + Math.floor(Math.random() * 10);
    return { lat, long, postcode };
}



const fakeAddress = () => {
    const { lat, long, postcode } = generateFakeLocation();
    return {
        address: `${randAddress().street}, Tamil Nadu, India,  ${postcode}`,
        lat,
        long,

    }
}

// calculate distance between two points in km
const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const p = 0.017453292519943295; // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

const formatDistance = (distance: number) => {
    if (distance < 1) {
        return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
}

export const orderRouter = router({
    generateDelivery: publicProcedure.mutation(async ({ ctx }) => {
        const userId = ctx.req.cookies.userId;
        if (!userId) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            })
        }

        const address = fakeAddress()
        const order = await ctx.prisma.order.create({
            data: {
                address: address.address,
                phone: randPhoneNumber(),
                price: Math.floor(Math.random() * 1000),
                cod: Math.random() > 0.5,
                recipient: `${randUser().firstName} ${randUser().lastName}`,
            }
        })


        await ctx.prisma.delivery.create({
            data: {
                orderId: order.id,
                userId: userId,
                latitude: address.lat,
                longitude: address.long,
                status: "PENDING",
            }
        })


        return {
            success: true,
        }

    }),
    getDelivery: publicProcedure.query(async ({ ctx }) => {
        const userId = ctx.req.cookies.userId;
        if (!userId) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            })
        }

        const delivery = await ctx.prisma.delivery.findMany({
            where: {
                userId: userId,
            },
            include: {
                order: true,
            },
        })

        

        // sort delivery by latitute and longitude
        const sortedDelivery = delivery.sort((a, b) => {
            const aLat = a.latitude;
            const bLat = b.latitude;
            const bLong = b.longitude;
            const aLong = a.longitude;

            const aDistance = Math.sqrt(Math.pow(aLat - HUB_LATITUDE, 2) + Math.pow(aLong - HUB_LONGITUDE, 2));
            const bDistance = Math.sqrt(Math.pow(bLat - HUB_LATITUDE, 2) + Math.pow(bLong - HUB_LONGITUDE, 2));

            return aDistance - bDistance;
        }).map((d) => {
            return {
                ...d,
                distance: formatDistance(distance(d.latitude, d.longitude, HUB_LATITUDE, HUB_LONGITUDE)),
            }
        })

        return {
            success: true,
            data: sortedDelivery
        }

    }),
    locations: publicProcedure.query(async ({ ctx }) => {
        const userId = ctx.req.cookies.userId;
        if (!userId) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            })
        }

        const delivery = await ctx.prisma.delivery.findMany({
            where: {
                userId: userId,
            },
            include: {
                order: true,
            },
        })


        const nextLocation = [[HUB_LATITUDE, HUB_LONGITUDE]];



        // sort delivery by latitute and longitude
        const sortedDelivery = delivery.sort((a, b) => {
            const aLat = a.latitude;
            const bLat = b.latitude;
            const bLong = b.longitude;
            const aLong = a.longitude;

            const aDistance = Math.sqrt(Math.pow(aLat - HUB_LATITUDE, 2) + Math.pow(aLong - HUB_LONGITUDE, 2));
            const bDistance = Math.sqrt(Math.pow(bLat - HUB_LATITUDE, 2) + Math.pow(bLong - HUB_LONGITUDE, 2));

            return aDistance - bDistance;
        }).map((delivery) => {

            const data = {
                ...delivery,
                point: [delivery.latitude, delivery.longitude],
                from: nextLocation[nextLocation.length - 1],
            }

            nextLocation.push([delivery.latitude, delivery.longitude]);

            return data;
        })

        return {
            success: true,
            data: sortedDelivery
        }

    }),
});
