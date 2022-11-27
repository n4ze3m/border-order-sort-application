import { trpc } from "../../../utils/trpc"
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Container } from "@mantine/core";
const HUB_LATITUDE = 13.0827;
const HUB_LONGITUDE = 80.2707;

import L from "leaflet";

export default function MapBody() {


    const {
        data: orders,
        status: ordersStatus,
    } = trpc.order.locations.useQuery()


    return <div>
        {ordersStatus === "loading" && <div>Loading...</div>}
        {ordersStatus === "error" && <div>Something went wrong</div>}
        {
            ordersStatus === "success" && (
                <MapContainer center={[HUB_LATITUDE, HUB_LONGITUDE]} zoom={13} style={{ height: '100vh' }}>
                    <TileLayer

                        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                    />
                    <Marker
                        position={[HUB_LATITUDE, HUB_LONGITUDE]}
                        icon={L.divIcon({
                            iconSize: [80, 80],
                            iconAnchor: [80 / 2, 80 + 9],
                            className: "mymarker",
                            html: "🏢",
                        })}
                    >
                        <Popup>
                            Sortation Hub
                        </Popup>
                    </Marker>
                    {
                        orders.data.map((order, index) => (
                            <Marker
                                key={index}
                                position={[order.latitude, order.longitude]}
                                icon={L.divIcon({
                                    iconSize: [80, 80],
                                    iconAnchor: [80 / 2, 80 + 9],
                                    className: "mymarker",
                                    html: "📦"
                                })}
                            >
                                <Popup>
                                    {order.order.recipient}
                                    {order.order.address}
                                </Popup>
                            </Marker>
                        ))
                    }
                </MapContainer>
            )
        }
    </div>
}
